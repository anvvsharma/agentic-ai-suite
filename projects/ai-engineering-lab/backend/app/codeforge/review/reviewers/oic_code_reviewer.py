"""
Oracle Integration Cloud (OIC) Analyzer
Analyzes OIC .iar packages for naming conventions and best practices
Comprehensive analysis including error handling, logging, performance, security, and design
"""
import zipfile
import xml.etree.ElementTree as ET
import re
from typing import List, Optional, Dict, Set
from io import BytesIO

from ...models import (
    Issue, Severity, Category, NamingConvention,
    StandardsTemplate, Technology
)
from ...rules_register.rule_config import RuleSet
from ...rules_register.rule_manager import rule_manager
from ...naming_conventions.validators.oic_naming_validator import oic_naming_validator


class OICAnalyzer:
    """Analyzes OIC .iar packages against coding standards"""
    
    def __init__(self, standards: Optional[StandardsTemplate] = None, ruleset: Optional[RuleSet] = None):
        self.standards = standards or self._get_default_standards()
        # Load ruleset - use provided, or load default for OIC
        self.ruleset = ruleset or rule_manager.get_default_ruleset(Technology.OIC)
        self.issues: List[Issue] = []
        self.integration_stats = {
            'has_global_fault_handler': False,
            'scope_count': 0,
            'scopes_with_fault_handlers': 0,
            'log_activities': 0,
            'external_invocations': 0,
            'retry_configurations': 0,
            'correlation_id_usage': False,
            'hardcoded_credentials': [],
            'http_endpoints': [],
            'https_endpoints': [],
            'loop_count': 0,
            'timeout_configurations': 0
        }
        # Track artifacts found for "ACTUAL vs RULES" report
        self.artifacts_found = {
            'integrations': [],
            'connections': [],
            'lookups': [],
            'packages': [],
            'projects': [],
            'activities': []
        }
        
    def analyze(self, code: str, file_name: str = "integration.iar") -> List[Issue]:
        """
        Analyze OIC .iar package
        
        Args:
            code: Content of .iar file (may be binary or XML)
            file_name: Name of the file being analyzed
            
        Returns:
            List of issues found
        """
        self.issues = []
        self.file_name = file_name
        
        try:
            # Try to parse as XML first (if it's extracted content)
            if code.strip().startswith('<?xml') or code.strip().startswith('<'):
                self._analyze_xml_content(code)
            else:
                # It's likely a binary .iar file
                self._analyze_iar_package(code)
                
        except Exception as e:
            # If we can't parse it, provide a helpful message
            self.issues.append(Issue(
                file_path=file_name,
                severity=Severity.INFO,
                category=Category.CODE_STRUCTURE,
                rule_id="oic_file_format",
                rule_name="OIC File Format",
                violation="Unable to fully parse .iar file - basic analysis performed",
                description=f"The .iar file appears to be in binary format. For detailed analysis, please extract the XML content. Error: {str(e)}"
            ))
            # Still try to do basic analysis on the raw content
            self._analyze_raw_content(code)
        
        # Generate and print summary report
        self._print_summary_report()
        
        return self.issues
    
    def get_naming_report(self) -> Dict:
        """Get naming conventions report as structured data for frontend display"""
        report_data = {
            'categories': [],
            'summary': {
                'total_artifacts': 0,
                'naming_issues': 0,
                'compliant_artifacts': 0
            }
        }
        
        # Process each category
        categories = [
            ('Projects', 'projects'),
            ('Packages', 'packages'),
            ('Integrations', 'integrations'),
            ('Connections', 'connections'),
            ('Lookups', 'lookups'),
            ('Activities', 'activities')
        ]
        
        for category_name, category_key in categories:
            artifacts = self.artifacts_found[category_key]
            if artifacts:
                category_data = {
                    'name': category_name,
                    'count': len(artifacts),
                    'artifacts': []
                }
                
                for artifact in artifacts:
                    # Check if this artifact has issues
                    has_issues = any(
                        issue.current_value == artifact['name'] or artifact['name'] in str(issue.violation)
                        for issue in self.issues
                        if issue.category == Category.NAMING_CONVENTION
                    )
                    
                    artifact_data = {
                        'status': 'invalid' if has_issues else 'valid',
                        'type': artifact.get('type', ''),  # For activities
                        'actual': artifact['name'],
                        'expected_pattern': artifact['expected_pattern'],
                        'example': artifact['example'],
                        'file': artifact['file'],
                        'issue': '',
                        'suggested': ''
                    }
                    
                    if has_issues:
                        # Find the specific issue
                        for issue in self.issues:
                            if issue.category == Category.NAMING_CONVENTION and \
                               (issue.current_value == artifact['name'] or artifact['name'] in str(issue.violation)):
                                artifact_data['issue'] = issue.violation
                                artifact_data['suggested'] = issue.suggested_value or ''
                                break
                    
                    category_data['artifacts'].append(artifact_data)
                
                report_data['categories'].append(category_data)
        
        # Calculate summary
        total_artifacts = sum(len(self.artifacts_found[key]) for key in ['projects', 'packages', 'integrations', 'connections', 'lookups', 'activities'])
        naming_issues = len([i for i in self.issues if i.category == Category.NAMING_CONVENTION])
        
        report_data['summary'] = {
            'total_artifacts': total_artifacts,
            'naming_issues': naming_issues,
            'compliant_artifacts': total_artifacts - naming_issues
        }
        
        return report_data
        
    
    def _is_rule_enabled(self, rule_id: str) -> bool:
        """Check if a rule is enabled in the current ruleset"""
        if not self.ruleset:
            return True  # If no ruleset, enable all rules
        
        rule = self.ruleset.get_rule(rule_id)
        return rule.enabled if rule else True
    
    def _get_rule_severity(self, rule_id: str, default: Severity = Severity.MEDIUM) -> Severity:
        """Get the configured severity for a rule"""
        if not self.ruleset:
            return default
        
        rule = self.ruleset.get_rule(rule_id)
        return rule.severity if rule else default
    
    def _get_rule_parameter(self, rule_id: str, param_name: str, default=None):
        """Get a configured parameter value for a rule"""
        if not self.ruleset:
            return default
        
        rule = self.ruleset.get_rule(rule_id)
        if rule and param_name in rule.parameters:
            return rule.parameters[param_name]
        return default
    
    def _analyze_iar_package(self, content: str):
        """Analyze .iar package (zip format) - extract and validate project structure"""
        try:
            # Try to treat as zip file
            with zipfile.ZipFile(BytesIO(content.encode('latin-1'))) as iar_zip:
                # List files in the package
                file_list = iar_zip.namelist()
                
                # First, look for project.xml to get project-level information
                project_xml_found = False
                for file_path in file_list:
                    if file_path.endswith('project.xml') or file_path == 'project.xml':
                        project_xml_found = True
                        xml_content = iar_zip.read(file_path).decode('utf-8')
                        self._analyze_project_xml(xml_content, file_path)
                        break
                
                # Then analyze other XML files (integrations, connections, etc.)
                for file_path in file_list:
                    if file_path.endswith('.xml') and not file_path.endswith('project.xml'):
                        xml_content = iar_zip.read(file_path).decode('utf-8')
                        self._analyze_xml_content(xml_content, file_path)
                        
        except Exception as e:
            # Fall back to raw content analysis
            self._analyze_raw_content(content)
    
    def _analyze_project_xml(self, xml_content: str, file_path: str):
        """Analyze project.xml to extract project name, integrations, connections, lookups"""
        try:
            root = ET.fromstring(xml_content)
            
            # Extract project name/identifier
            project_name = root.get('name') or root.get('id') or root.get('identifier')
            if project_name:
                self._check_project_naming(project_name, file_path)
            
            # Extract package name if present
            package_name = root.get('package') or root.get('packageName')
            if package_name:
                self._check_package_naming(package_name, file_path)
            
            # Extract integrations from project
            for integration in root.findall('.//integration') + root.findall('.//Integration'):
                int_name = integration.get('name') or integration.get('id')
                int_identifier = integration.get('identifier')
                if int_name:
                    self._check_integration_naming(int_name, file_path)
                if int_identifier and int_identifier != int_name:
                    self._check_integration_identifier(int_identifier, file_path)
            
            # Extract connections from project
            for connection in root.findall('.//connection') + root.findall('.//Connection'):
                conn_name = connection.get('name') or connection.get('id')
                if conn_name:
                    self._check_connection_naming(conn_name, file_path)
            
            # Extract lookups from project
            for lookup in root.findall('.//lookup') + root.findall('.//Lookup'):
                lookup_name = lookup.get('name') or lookup.get('id')
                if lookup_name:
                    self._check_lookup_naming(lookup_name, file_path)
                    
        except ET.ParseError as e:
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.LOW,
                category=Category.CODE_STRUCTURE,
                rule_id="project_xml_parse_error",
                rule_name="Project XML Parse Error",
                violation=f"Unable to parse project.xml: {str(e)}",
                description="The project.xml content could not be parsed. Please check for syntax errors."
            ))
    
    def _analyze_xml_content(self, xml_content: str, file_path: str = "integration.xml"):
        """Analyze XML content from OIC integration - only for integration-specific files"""
        try:
            root = ET.fromstring(xml_content)
            
            # Determine the type of XML file based on root element or file path
            root_tag = root.tag.lower().split('}')[-1]  # Remove namespace if present
            
            # Skip if this is a connection, lookup, or other non-integration file
            if any(keyword in file_path.lower() for keyword in ['connection', 'lookup', 'package']):
                return
            
            # Only process integration files
            if 'integration' in root_tag or 'integration' in file_path.lower():
                # Check integration name (extract from file name if needed)
                integration_name = root.get('name') or root.get('id')
                if not integration_name and file_path:
                    # Extract integration name from file path (remove version and extension)
                    # Example: AA_CPQ_TO_ORACLE_SALEORDER_INT_04.00.0000.iar -> AA_CPQ_TO_ORACLE_SALEORDER_INT
                    base_name = file_path.split('/')[-1]  # Get filename
                    base_name = base_name.replace('.iar', '').replace('.xml', '')
                    # Remove version pattern (e.g., _04.00.0000)
                    integration_name = re.sub(r'_\d{2}\.\d{2}\.\d{4}$', '', base_name)
                
                if integration_name:
                    self._check_integration_naming(integration_name, file_path)
                
                # Perform comprehensive analysis (only once per integration)
                if not hasattr(self, '_comprehensive_analysis_done'):
                    self._comprehensive_analysis_done = True
                    self._analyze_comprehensive(root, file_path)
                    
        except ET.ParseError as e:
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.LOW,
                category=Category.CODE_STRUCTURE,
                rule_id="xml_parse_error",
                rule_name="XML Parse Error",
                violation=f"Unable to parse XML: {str(e)}",
                description="The XML content could not be parsed. Please check for syntax errors."
            ))
    
    def _analyze_comprehensive(self, root: ET.Element, file_path: str):
        """Perform comprehensive analysis including error handling, logging, security, etc."""
        # Error Handling Analysis
        self._check_error_handling(root, file_path)
        
        # Logging Analysis
        self._check_logging(root, file_path)
        
        # Performance Analysis
        self._check_performance(root, file_path)
        
        # Security Analysis
        self._check_security(root, file_path)
        
        # Design Analysis
        self._check_design(root, file_path)
        
        # Documentation Analysis
        self._check_documentation(root, file_path)
        
        # OIC Activity Naming Analysis
        self._check_activity_naming(root, file_path)
    
    def _check_error_handling(self, root: ET.Element, file_path: str):
        """Check error handling implementation"""
        # Check for global fault handler (only once per integration, not per file)
        global_fault_handlers = root.findall('.//{*}faultHandlers') + root.findall('.//faultHandlers')
        if not global_fault_handlers:
            # Only add this issue if we haven't already flagged it
            if not any(issue.rule_id == "global_fault_handler" for issue in self.issues):
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.HIGH,
                    category=Category.ERROR_HANDLING,
                    rule_id="global_fault_handler",
                    rule_name="Global Fault Handler Required",
                    violation="No global fault handler detected",
                    description="Integration should have a global fault handler to catch all unhandled errors. "
                               "This ensures graceful error handling and proper error logging.",
                    line_number=1
                ))
        else:
            self.integration_stats['has_global_fault_handler'] = True
        
        # Check scopes and their fault handlers
        scopes = root.findall('.//{*}scope') + root.findall('.//scope')
        self.integration_stats['scope_count'] = len(scopes)
        
        for scope in scopes:
            scope_name = scope.get('name', 'Unknown')
            scope_fault_handlers = scope.findall('.//{*}faultHandlers') + scope.findall('.//faultHandlers')
            
            if scope_fault_handlers:
                self.integration_stats['scopes_with_fault_handlers'] += 1
                
                # Check for retry logic
                catches = scope.findall('.//{*}catch') + scope.findall('.//catch')
                has_retry = False
                for catch in catches:
                    retry = catch.find('.//{*}retry') or catch.find('.//retry')
                    if retry is not None:
                        has_retry = True
                        self.integration_stats['retry_configurations'] += 1
                        
                        # Check retry configuration
                        retry_count = retry.get('count', '0')
                        retry_interval = retry.get('interval', '')
                        
                        try:
                            if int(retry_count) < 1:
                                self.issues.append(Issue(
                                    file_path=file_path,
                                    severity=Severity.MEDIUM,
                                    category=Category.ERROR_HANDLING,
                                    rule_id="retry_count",
                                    rule_name="Retry Count Configuration",
                                    violation=f"Scope '{scope_name}' has retry count of {retry_count}",
                                    suggested_value="3",
                                    description="Retry count should be at least 1, recommended 3 for transient failures"
                                ))
                        except ValueError:
                            pass
                
                if not has_retry:
                    # Check if scope has external invocations
                    invokes = scope.findall('.//{*}invoke') + scope.findall('.//invoke')
                    if invokes:
                        self.issues.append(Issue(
                            file_path=file_path,
                            severity=Severity.MEDIUM,
                            category=Category.ERROR_HANDLING,
                            rule_id="missing_retry",
                            rule_name="Missing Retry Logic",
                            violation=f"Scope '{scope_name}' has external invocations but no retry logic",
                            description="External API calls should have retry logic with exponential backoff for transient failures"
                        ))
            else:
                # Scope without fault handler
                invokes = scope.findall('.//{*}invoke') + scope.findall('.//invoke')
                if invokes:
                    self.issues.append(Issue(
                        file_path=file_path,
                        severity=Severity.HIGH,
                        category=Category.ERROR_HANDLING,
                        rule_id="scope_fault_handler",
                        rule_name="Scope-Level Fault Handler Required",
                        violation=f"Scope '{scope_name}' has external invocations but no fault handler",
                        description="Scopes with external invocations should have fault handlers for proper error handling"
                    ))
    
    def _check_logging(self, root: ET.Element, file_path: str):
        """Check logging implementation"""
        # Count log activities - look for various OIC logging patterns
        log_activities = (
            root.findall('.//{*}log') + root.findall('.//log') +
            root.findall('.//{*}logger') + root.findall('.//logger') +
            root.findall('.//{*}LogActivity') + root.findall('.//LogActivity') +
            root.findall('.//{*}logActivity') + root.findall('.//logActivity')
        )
        self.integration_stats['log_activities'] = len(log_activities)
        
        # Count external invocations
        invokes = root.findall('.//{*}invoke') + root.findall('.//invoke')
        self.integration_stats['external_invocations'] = len(invokes)
        
        # Only flag if there are NO log activities at all and there are external calls
        if self.integration_stats['log_activities'] == 0 and len(invokes) > 0:
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.LOW,
                category=Category.LOGGING,
                rule_id="no_logging",
                rule_name="No Logging Activities Found",
                violation="No log activities detected in integration",
                suggested_value="Add log activities at key points for debugging",
                description="Consider adding log activities at integration start, before/after external calls, and completion. "
                           "This helps with debugging and monitoring in production."
            ))
        
        # Check for correlation ID usage
        correlation_patterns = ['correlation', 'correlationid', 'tracking', 'trackingid', 'requestid']
        xml_string = ET.tostring(root, encoding='unicode')
        
        for pattern in correlation_patterns:
            if pattern in xml_string.lower():
                self.integration_stats['correlation_id_usage'] = True
                break
        
        if not self.integration_stats['correlation_id_usage']:
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.MEDIUM,
                category=Category.LOGGING,
                rule_id="no_correlation_id",
                rule_name="Missing Correlation ID",
                violation="No correlation ID usage detected",
                description="Use correlation IDs for end-to-end request tracking across systems. "
                           "This helps in debugging and monitoring distributed transactions."
            ))
        
        # Check for sensitive data in logs (avoid duplicates)
        sensitive_patterns = [
            (r'password\s*[=:]\s*["\']?[\w]+', 'password'),
            (r'secret\s*[=:]\s*["\']?[\w]+', 'secret'),
            (r'api[_-]?key\s*[=:]\s*["\']?[\w]+', 'API key'),
            (r'\b\d{16}\b', 'credit card number'),
            (r'\b\d{3}-\d{2}-\d{4}\b', 'SSN')
        ]
        
        found_sensitive_data = set()  # Track what we've already reported
        for log_activity in log_activities:
            log_content = ET.tostring(log_activity, encoding='unicode')
            for pattern, data_type in sensitive_patterns:
                if re.search(pattern, log_content, re.IGNORECASE):
                    # Only report each type once
                    if data_type not in found_sensitive_data:
                        found_sensitive_data.add(data_type)
                        self.issues.append(Issue(
                            file_path=file_path,
                            severity=Severity.CRITICAL,
                            category=Category.SECURITY,
                            rule_id="sensitive_data_in_logs",
                            rule_name="Sensitive Data in Logs",
                            violation=f"Potential {data_type} found in log activity",
                            description=f"Never log sensitive data like passwords, API keys, credit cards, or PII. "
                                       f"Mask or exclude {data_type} from logs."
                        ))
    
    def _check_performance(self, root: ET.Element, file_path: str):
        """Check performance-related issues"""
        # Check for loops
        loops = root.findall('.//{*}for-each') + root.findall('.//for-each') + \
                root.findall('.//{*}while') + root.findall('.//while')
        self.integration_stats['loop_count'] = len(loops)
        
        for loop in loops:
            # Check if loop has iteration limit
            max_iterations = loop.get('maxIterations') or loop.get('max-iterations')
            if not max_iterations:
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.LOW,  # PRIORITY 3: Performance (lower priority)
                    category=Category.PERFORMANCE,
                    rule_id="loop_no_limit",
                    rule_name="Loop Without Iteration Limit",
                    violation="Loop found without maximum iteration limit",
                    suggested_value="maxIterations='1000'",
                    description="Loops should have maximum iteration limits to prevent infinite loops and performance issues. "
                               "Recommended limit: 1000 iterations."
                ))
            else:
                try:
                    if int(max_iterations) > 1000:
                        self.issues.append(Issue(
                            file_path=file_path,
                            severity=Severity.MEDIUM,
                            category=Category.PERFORMANCE,
                            rule_id="loop_high_limit",
                            rule_name="High Loop Iteration Limit",
                            violation=f"Loop has high iteration limit: {max_iterations}",
                            suggested_value="Consider batch processing for large datasets",
                            description="High iteration counts can cause performance issues. "
                                       "Consider implementing batch processing or pagination."
                        ))
                except ValueError:
                    pass
        
        # Check for timeout configurations (OIC handles many timeouts automatically)
        # Only flag if it's a critical external REST/SOAP call without explicit timeout
        invokes = root.findall('.//{*}invoke') + root.findall('.//invoke')
        for invoke in invokes:
            timeout = invoke.get('timeout') or invoke.get('readTimeout')
            partner_link = invoke.get('partnerLink', '')
            
            # Skip if no partner link or if it's an internal/library call
            if not partner_link or partner_link == 'Unknown':
                continue
                
            # Only flag for external REST/SOAP services without timeout
            if not timeout and any(keyword in partner_link.lower() for keyword in ['rest', 'soap', 'http', 'api']):
                self.integration_stats['timeout_configurations'] += 1
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.LOW,
                    category=Category.PERFORMANCE,
                    rule_id="no_timeout",
                    rule_name="Consider Timeout Configuration",
                    violation=f"External invoke to '{partner_link}' could benefit from explicit timeout",
                    suggested_value="Consider adding timeout='PT30S' for critical calls",
                    description="While OIC handles many timeouts automatically, explicit timeout configuration "
                               "for critical external calls can prevent integration hangs. Recommended: 30 seconds."
                ))
        
        # Check for pagination hints
        xml_string = ET.tostring(root, encoding='unicode').lower()
        has_pagination = any(keyword in xml_string for keyword in ['page', 'offset', 'limit', 'batch'])
        
        if self.integration_stats['loop_count'] > 0 and not has_pagination:
            # Only report once
            if not any(issue.rule_id == "no_pagination" for issue in self.issues):
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.LOW,
                    category=Category.PERFORMANCE,
                    rule_id="no_pagination",
                    rule_name="Consider Pagination",
                    violation="Integration has loops but no pagination detected",
                    description="For processing large datasets, implement pagination to improve performance and reduce memory usage."
                ))
    
    def _check_security(self, root: ET.Element, file_path: str):
        """Check security-related issues"""
        xml_string = ET.tostring(root, encoding='unicode')
        
        # Check for hardcoded credentials
        credential_patterns = [
            (r'<password>(?![\s]*\$\{)([^<]+)</password>', 'password'),
            (r'<apiKey>(?![\s]*\$\{)([^<]+)</apiKey>', 'API key'),
            (r'<secret>(?![\s]*\$\{)([^<]+)</secret>', 'secret'),
            (r'password\s*=\s*["\'](?!\$\{)([^"\']+)["\']', 'password attribute'),
            (r'apikey\s*=\s*["\'](?!\$\{)([^"\']+)["\']', 'API key attribute')
        ]
        
        # Track reported credential types to avoid duplicates
        reported_cred_types = set()
        
        for pattern, cred_type in credential_patterns:
            matches = re.findall(pattern, xml_string, re.IGNORECASE)
            if matches:
                self.integration_stats['hardcoded_credentials'].extend(matches)
                # Only report each credential type once
                if cred_type not in reported_cred_types:
                    reported_cred_types.add(cred_type)
                    self.issues.append(Issue(
                        file_path=file_path,
                        severity=Severity.CRITICAL,
                        category=Category.SECURITY,
                        rule_id="hardcoded_credentials",
                        rule_name="Hardcoded Credentials Detected",
                        violation=f"Hardcoded {cred_type} found in integration",
                        description=f"Never hardcode credentials. Use OIC credential store or environment variables. "
                                   f"Hardcoded credentials pose serious security risks."
                    ))
        
        # Check for HTTP vs HTTPS (exclude XML namespaces and Oracle internal URLs)
        url_pattern = r'(https?://[^\s<>"\']+)'
        urls = re.findall(url_pattern, xml_string, re.IGNORECASE)
        
        # Filter out XML namespaces and Oracle internal URLs
        excluded_patterns = [
            'xmlns.oracle.com',
            'xmlns:',  # Any XML namespace declaration
            'www.w3.org',
            'schemas.xmlsoap.org',
            'java.sun.com',
            'oracle.com/cloud/adapter',
            'oracle.com/cloud/generic',
            'oracle.com/cloud',
            'oracle.com/bpel',
            'oracle.com/sca',
            'oracle.com/oracleas',
            'oracle.com/weblogic',
            'oracle.com/integration',
            'oracle.com/ics',
            'oracle.com/oic',
            'xml.oracle.com/types',
            'TargetNamespace.com',  # XML schema target namespace
            'www.oracle.com/XSL/*',
            'TargetNamespace.com/fileReference/*',  # XML schema location
            'www.oracle.rest.converters.autogeneratedns.com',
            'www.oracle.com/xsl/webmapper/state',
            'www.eclipse.org',
            'oracle.com/2014',  # OIC project namespaces (e.g., /2014/03/ics/project)
            'schemas.oracle.com',
            'targetNamespace',  # XML schema target namespace
            'schemaLocation'  # XML schema location
        ]
        
        # Track reported HTTP endpoints to avoid duplicates
        reported_http_endpoints = set()
        
        for url in urls:
            # Skip if it's an XML namespace or Oracle internal URL
            if any(pattern in url.lower() for pattern in excluded_patterns):
                continue
                
            if url.lower().startswith('http://'):
                self.integration_stats['http_endpoints'].append(url)
                # Only report each unique HTTP endpoint once
                if url not in reported_http_endpoints:
                    reported_http_endpoints.add(url)
                    self.issues.append(Issue(
                        file_path=file_path,
                        severity=Severity.CRITICAL,
                        category=Category.SECURITY,
                        rule_id="http_endpoint",
                        rule_name="Insecure HTTP Endpoint",
                        violation=f"HTTP endpoint detected: {url}",
                        suggested_value=url.replace('http://', 'https://'),
                        description="Use HTTPS for all external communications to ensure data encryption in transit. "
                                   "HTTP is insecure and exposes data to interception."
                    ))
            else:
                self.integration_stats['https_endpoints'].append(url)
        
        # Check for input validation (only report once)
        validates = root.findall('.//{*}validate') + root.findall('.//validate')
        invokes = root.findall('.//{*}invoke') + root.findall('.//invoke')
        if not validates and invokes:
            if not any(issue.rule_id == "no_input_validation" for issue in self.issues):
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.MEDIUM,
                    category=Category.SECURITY,
                    rule_id="no_input_validation",
                    rule_name="Missing Input Validation",
                    violation="No input validation detected",
                    description="Implement input validation to prevent injection attacks and ensure data integrity. "
                               "Validate all external inputs before processing."
                ))
    
    def _check_design(self, root: ET.Element, file_path: str):
        """Check design and architecture"""
        # Check scope naming conventions
        scopes = root.findall('.//{*}scope') + root.findall('.//scope')
        for scope in scopes:
            scope_name = scope.get('name', '')
            if scope_name and not scope_name[0].isupper():
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.LOW,
                    category=Category.NAMING_CONVENTION,
                    rule_id="scope_naming",
                    rule_name="Scope Naming Convention",
                    violation=f"Scope '{scope_name}' should use PascalCase",
                    current_value=scope_name,
                    suggested_value=scope_name[0].upper() + scope_name[1:],
                    description="Scopes should use PascalCase naming for consistency and readability"
                ))
        
        # Check for modularization (sub-integrations)
        sub_integrations = root.findall('.//{*}invoke[@type="library"]') + \
                          root.findall('.//invoke[@type="library"]')
        
        # Count activities to assess complexity
        all_activities = root.findall('.//{*}assign') + root.findall('.//assign') + \
                        root.findall('.//{*}invoke') + root.findall('.//invoke') + \
                        root.findall('.//{*}transform') + root.findall('.//transform')
        
        if len(all_activities) > 20 and len(sub_integrations) == 0:
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.MEDIUM,
                category=Category.DESIGN_PATTERN,
                rule_id="large_integration",
                rule_name="Large Integration Without Modularization",
                violation=f"Integration has {len(all_activities)} activities but no sub-integrations",
                description="Large integrations should be broken down into reusable sub-integrations. "
                           "Create library integrations for common logic to improve maintainability and reusability."
            ))
        
        # Check for reusability opportunities
        transforms = root.findall('.//{*}transform') + root.findall('.//transform')
        if len(transforms) > 3:
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.MEDIUM,  # PRIORITY 2: Design patterns (important)
                category=Category.DESIGN_PATTERN,
                rule_id="reusability_opportunity",
                rule_name="Reusability Opportunity",
                violation=f"Multiple transformations ({len(transforms)}) detected",
                description="Consider creating reusable transformation library integrations for common mapping logic. "
                           "This is a medium-priority design pattern issue."
            ))
    
    def _check_documentation(self, root: ET.Element, file_path: str):
        """Check documentation completeness"""
        # Check for integration description (only once per integration)
        if not any(issue.rule_id == "missing_description" for issue in self.issues):
            description = root.find('.//{*}description') or root.find('.//description') or \
                         root.find('.//{*}annotation') or root.find('.//annotation')
            
            # Only flag if there's absolutely no description/annotation
            if not description or not description.text or len(description.text.strip()) < 5:
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.INFO,
                    category=Category.DOCUMENTATION,
                    rule_id="missing_description",
                    rule_name="Consider Adding Integration Description",
                    violation="Integration could benefit from description/annotation",
                    description="In OIC Integration Designer, add a description in the integration properties panel. "
                               "This helps team members understand the integration's purpose, inputs/outputs, and dependencies. "
                               "While not mandatory, it's a best practice for maintainability."
                ))
        
        # Check connection documentation (deduplicate by connection name)
        connections = root.findall('.//{*}connection') + root.findall('.//connection')
        checked_connections = set()
        for conn in connections:
            conn_name = conn.get('name', 'Unknown')
            if conn_name in checked_connections:
                continue
            checked_connections.add(conn_name)
            
            conn_desc = conn.find('.//{*}description') or conn.find('.//description')
            if not conn_desc or not conn_desc.text:
                self.issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.LOW,
                    category=Category.DOCUMENTATION,
                    rule_id="connection_documentation",
                    rule_name="Missing Connection Documentation",
                    violation=f"Connection '{conn_name}' lacks documentation",
                    description="Document connection purpose, target system, and configuration details"
                ))
    
    def _analyze_raw_content(self, content: str):
        """Analyze raw content for basic patterns"""
        # Look for common OIC patterns in the raw content
        if 'integration' in content.lower():
            # Check for naming patterns
            name_patterns = [
                r'name="([^"]+)"',
                r'id="([^"]+)"',
                r'<name>([^<]+)</name>'
            ]
            
            for pattern in name_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches[:5]:  # Limit to first 5 matches
                    if len(match) > 3:  # Skip very short matches
                        self._check_integration_naming(match, self.file_name)
    
    def _check_integration_naming(self, name: str, file_path: str):
        """Check integration naming convention using comprehensive OIC standards"""
        # Track artifact found
        self.artifacts_found['integrations'].append({
            'name': name,
            'file': file_path,
            'expected_pattern': '<ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>',
            'example': 'BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT'
        })
        # Use the comprehensive naming validator
        naming_issues = oic_naming_validator.validate_integration_name(name, file_path)
        self.issues.extend(naming_issues)
    
    def _check_connection_naming(self, name: str, file_path: str):
        """Check connection naming convention using comprehensive OIC standards"""
        # Track artifact found
        self.artifacts_found['connections'].append({
            'name': name,
            'file': file_path,
            'expected_pattern': '<ORG>_<SYSTEM>_<ADAPTER>_CONN',
            'example': 'BCRX_SALESFORCE_REST_CONN'
        })
        naming_issues = oic_naming_validator.validate_connection_name(name, file_path)
        self.issues.extend(naming_issues)
    
    def _check_lookup_naming(self, name: str, file_path: str):
        """Check lookup naming convention using comprehensive OIC standards"""
        # Track artifact found
        self.artifacts_found['lookups'].append({
            'name': name,
            'file': file_path,
            'expected_pattern': '<ORG>_<SOURCE>_<PURPOSE>_LOOKUP',
            'example': 'BCRX_ERP_CMN_INT_LOOKUP'
        })
        naming_issues = oic_naming_validator.validate_lookup_name(name, file_path)
        self.issues.extend(naming_issues)
    
    def _check_integration_identifier(self, identifier: str, file_path: str):
        """Check integration identifier naming convention using comprehensive OIC standards"""
        naming_issues = oic_naming_validator.validate_integration_identifier(identifier, file_path)
        self.issues.extend(naming_issues)
    
    def _check_project_naming(self, name: str, file_path: str):
        """Check project naming convention using comprehensive OIC standards"""
        # Track artifact found
        self.artifacts_found['projects'].append({
            'name': name,
            'file': file_path,
            'expected_pattern': 'com.<org>.<project>.<module>',
            'example': 'com.bcrx.erp.im'
        })
        naming_issues = oic_naming_validator.validate_project_name(name, file_path)
        self.issues.extend(naming_issues)
    
    def _check_package_naming(self, name: str, file_path: str):
        """Check package naming convention using comprehensive OIC standards"""
        # Track artifact found
        self.artifacts_found['packages'].append({
            'name': name,
            'file': file_path,
            'expected_pattern': 'com.<org>.<project>.<module>',
            'example': 'com.bcrx.erp.im'
        })
        naming_issues = oic_naming_validator.validate_package_name(name, file_path)
        self.issues.extend(naming_issues)
    
    def _check_mapping_naming(self, name: str, file_path: str):
        """Check mapping naming convention"""
        if not any(suffix in name.lower() for suffix in ['_map', 'mapping', '_xform']):
            self.issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,  # PRIORITY 1: Naming conventions
                category=Category.NAMING_CONVENTION,
                rule_id="mapping_suffix",
                rule_name="Mapping Suffix Convention",
                violation=f"Mapping '{name}' should include '_MAP' or '_XFORM' suffix",
                current_value=name,
                suggested_value=f"{name}_MAP",
                description="Mappings should have clear suffixes for easy identification. "
                           "This is a high-priority naming convention issue."
            ))
    
    def _check_activity_naming(self, root: ET.Element, file_path: str):
        """Check naming conventions for OIC activities using comprehensive OIC standards"""
        
        # Define OIC activity types to check with their expected patterns
        activity_patterns = {
            'assign': ('Asg_', 'Asg_VariableName'),
            'map': ('Map to ', 'Map to TargetObject'),
            'logger': ('Log_', 'Log_OrderDetails'),
            'notification': ('Notify_', 'Notify_Order_Success'),
            'stagefile': ('Stg_', 'Stg_ProcessFile'),
            'wait': ('Wait_', 'Wait_5Seconds'),
            'foreach': ('ForEach_', 'ForEach_OrderItem'),
            'scope': ('Scp_', 'Scp_ProcessOrder'),
            'switch': ('IF ', 'IF OrderStatus'),
            'while': ('While_', 'While_HasItems_True'),
            'javascript': ('JS_', 'JS_CalculateTotal'),
            'b2b': ('B2b_', 'B2b_ProcessEDI'),
            'datastitch': ('ds_', 'ds_MergeData')
        }
        
        # Check each activity type
        for activity_type, (prefix, example) in activity_patterns.items():
            # Find all activities of this type (with and without namespace)
            activities = root.findall(f'.//{{{"{*}"}}}' + activity_type) + root.findall(f'.//{activity_type}')
            
            for activity in activities:
                activity_name = activity.get('name') or activity.get('id')
                if not activity_name:
                    continue
                
                # Skip very short or auto-generated names
                if len(activity_name) < 3 or activity_name.startswith('_'):
                    continue
                
                # Track activity found
                self.artifacts_found['activities'].append({
                    'type': activity_type.title(),
                    'name': activity_name,
                    'file': file_path,
                    'expected_pattern': f'Must start with "{prefix}"',
                    'example': example
                })
                
                # Use comprehensive naming validator
                naming_issues = oic_naming_validator.validate_action_name(activity_type, activity_name, file_path)
                self.issues.extend(naming_issues)
    
    @staticmethod
    def _to_upper_snake_case(name: str) -> str:
        """Convert name to UPPER_SNAKE_CASE"""
        # Insert underscore before uppercase letters
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        s2 = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1)
        return s2.upper()
    
    def _print_summary_report(self):
        """Generate and print ACTUAL vs RULES summary report"""
        print("\n" + "="*80)
        print("OIC NAMING CONVENTIONS - ACTUAL vs RULES REPORT")
        print("="*80)
        
        # Report for each category
        categories = [
            ('Projects', 'projects'),
            ('Packages', 'packages'),
            ('Integrations', 'integrations'),
            ('Connections', 'connections'),
            ('Lookups', 'lookups'),
            ('Activities', 'activities')
        ]
        
        for category_name, category_key in categories:
            artifacts = self.artifacts_found[category_key]
            if artifacts:
                print(f"\n📋 {category_name.upper()} ({len(artifacts)} found)")
                print("-" * 80)
                
                for i, artifact in enumerate(artifacts, 1):
                    # Check if this artifact has issues
                    has_issues = any(
                        issue.current_value == artifact['name'] or artifact['name'] in str(issue.violation)
                        for issue in self.issues
                        if issue.category == Category.NAMING_CONVENTION
                    )
                    
                    status = "❌ INVALID" if has_issues else "✅ VALID"
                    
                    print(f"\n  {i}. {status}")
                    # For activities, show type
                    if category_key == 'activities':
                        print(f"     Activity Type:     {artifact['type']}")
                    print(f"     ACTUAL in code:    '{artifact['name']}'")
                    print(f"     EXPECTED pattern:  {artifact['expected_pattern']}")
                    print(f"     Example:           {artifact['example']}")
                    print(f"     File:              {artifact['file']}")
                    
                    if has_issues:
                        # Find and display the specific issue
                        for issue in self.issues:
                            if issue.category == Category.NAMING_CONVENTION and \
                               (issue.current_value == artifact['name'] or artifact['name'] in str(issue.violation)):
                                print(f"     Issue:             {issue.violation}")
                                if issue.suggested_value:
                                    print(f"     Suggested:         {issue.suggested_value}")
                                break
            else:
                print(f"\n📋 {category_name.upper()}")
                print("-" * 80)
                print(f"  No {category_name.lower()} found in this package")
        
        # Summary statistics
        print("\n" + "="*80)
        print("SUMMARY")
        print("="*80)
        total_artifacts = sum(len(self.artifacts_found[key]) for key in ['projects', 'packages', 'integrations', 'connections', 'lookups', 'activities'])
        naming_issues = [i for i in self.issues if i.category == Category.NAMING_CONVENTION]
        
        print(f"  Total Artifacts Found:     {total_artifacts}")
        print(f"  Naming Convention Issues:  {len(naming_issues)}")
        print(f"  Compliant Artifacts:       {total_artifacts - len(naming_issues)}")
        print("="*80 + "\n")
    
    @staticmethod
    def _get_default_standards() -> StandardsTemplate:
        """Get default OIC coding standards"""
        return StandardsTemplate(
            version="1.0",
            technology=Technology.OIC,
            organization="default",
            naming_conventions={
                "integrations": NamingConvention(
                    pattern=r"^[A-Z][A-Z0-9_]*$",
                    case="UPPER_SNAKE_CASE",
                    examples=["SALES_ORDER_SYNC", "CUSTOMER_DATA_LOAD", "INVOICE_PROCESS"]
                ),
                "connections": NamingConvention(
                    pattern=r"^[A-Z][A-Z0-9_]*_CONN$",
                    case="UPPER_SNAKE_CASE",
                    examples=["ERP_DB_CONN", "SFDC_REST_CONN", "FTP_SERVER_CONN"]
                ),
                "lookups": NamingConvention(
                    pattern=r"^[A-Z][A-Z0-9_]*_LKP$",
                    case="UPPER_SNAKE_CASE",
                    examples=["STATUS_CODE_LKP", "COUNTRY_MAP_LKP", "ERROR_MSG_LKP"]
                )
            },
            code_structure={},
            design_patterns={},
            error_handling={},
            logging={},
            security={},
            performance={}
        )

