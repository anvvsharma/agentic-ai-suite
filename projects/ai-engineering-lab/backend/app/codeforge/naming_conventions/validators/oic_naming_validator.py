"""
OIC Naming Convention Validator
Implements comprehensive OIC naming standards from OIC-Naming-Standards.md
Validates integration names, connections, lookups, packages, agents, libraries, and actions
"""

import re
from typing import List, Dict, Optional, Tuple
from ...models import Issue, Severity, Category


class OICNamingValidator:
    """Validates OIC artifacts against comprehensive naming standards"""
    
    # Reserved words that cannot be used in identifiers
    RESERVED_PATTERNS = [
        r'-(BA|XBA|TA|R)-',  # Reserved patterns in identifiers
        r'\.(ba|xba|ta|r)\.',  # Reserved patterns in package names
    ]
    
    # Integration naming patterns
    # Note: ORG code should be 3-4 characters per standard, but 2 chars is accepted with warning
    # Pattern allows 3+ parts between ORG and TYPE for flexibility (e.g., AA_CPQ_TO_ORACLE_SALEORDER_INT)
    INTEGRATION_PATTERNS = {
        'name': r'^[A-Z]{2,4}(_[A-Z0-9]+){3,}_(INT|SCH|SUB|RT)$',
        'name_strict': r'^[A-Z]{3,4}(_[A-Z0-9]+){3,}_(INT|SCH|SUB|RT)$',
        'identifier': r'^[A-Z]{2,4}(_[A-Z0-9]+){3,}$',
        'version': r'^\d{2}\.\d{2}\.\d{4}$',
        'package': r'^com\.[a-z]{2,4}\.[a-z0-9]+\.[a-z0-9]+$',
    }
    
    # Connection naming patterns
    CONNECTION_PATTERNS = {
        'name': r'^[A-Z]{3,4}_[A-Z0-9]+_(REST|SOAP|FTP|DB|FILE)_CONN$',
        'identifier': r'^[A-Z]{3,4}_[A-Z0-9]+_(REST|SOAP|FTP|DB|FILE)_CONN$',
        'security_policy': r'^[A-Z]{3,4}_[A-Z0-9]+_SECURITY_POLICY$',
    }
    
    # Lookup naming patterns
    LOOKUP_PATTERNS = {
        'name': r'^[A-Z]{3,4}_[A-Z0-9]+_[A-Z0-9_]+_LOOKUP$',
    }
    
    # Package/Project naming patterns
    PACKAGE_PATTERNS = {
        'name': r'^com\.[a-z]{3,4}\.[a-z0-9]+\.[a-z0-9]+$',
    }
    
    # Agent naming patterns
    AGENT_PATTERNS = {
        'name': r'^[A-Z]{3,4}_[A-Z0-9]+_(DB|SFTP|FTP)_AGENT$',
        'identifier': r'^[A-Z]{3,4}_[A-Z0-9]+_(DB|SFTP|FTP)_AGENT$',
    }
    
    # Library naming patterns
    LIBRARY_PATTERNS = {
        'name': r'^[A-Za-z]{3,4}_[A-Za-z0-9_]+$',
        'identifier': r'^[A-Za-z]{3,4}_[A-Za-z0-9_]+$',
    }
    
    # Action naming patterns (OIC activities)
    ACTION_PATTERNS = {
        'assign': r'^Asg_[A-Za-z][A-Za-z0-9_]*$',
        'map': r'^Map to [A-Za-z][A-Za-z0-9_]*$',
        'logger': r'^Log_[A-Za-z][A-Za-z0-9_]*$',
        'foreach': r'^ForEach_[A-Za-z][A-Za-z0-9_]*$',
        'switch': r'^IF [A-Za-z].*$',
        'notification': r'^Notify_[A-Za-z][A-Za-z0-9_]*_[A-Za-z][A-Za-z0-9_]*$',
        'scope': r'^Scp_[A-Za-z][A-Za-z0-9_]*$',
        'while': r'^While_[A-Za-z][A-Za-z0-9_]*_[A-Za-z][A-Za-z0-9_]*$',
        'stagefile': r'^Stg_[A-Za-z][A-Za-z0-9_]*$',
        'javascript': r'^JS_[A-Za-z][A-Za-z0-9_]*$',
        'wait': r'^Wait_[A-Za-z0-9]+$',
        'b2b': r'^B2b_[A-Za-z][A-Za-z0-9_]*$',
        'datastitch': r'^ds_[A-Za-z][A-Za-z0-9_]*$',
    }
    
    def __init__(self):
        self.issues: List[Issue] = []
    
    def validate_integration_name(self, name: str, file_path: str) -> List[Issue]:
        """
        Validate integration name against pattern: <ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>
        Example: BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT
        """
        issues = []
        
        # Check pattern match (lenient - accepts 2-4 char ORG)
        if not re.match(self.INTEGRATION_PATTERNS['name'], name):
            # Provide detailed breakdown of what's wrong
            parts = name.split('_')
            expected_parts = ['ORG (2-4 chars)', 'SOURCE', 'TARGET', 'OBJECT', 'TYPE (INT/SCH/SUB/RT)']
            
            violation_details = []
            if len(parts) < 5:
                violation_details.append(f"Expected at least 5 parts (ORG + 3+ middle parts + TYPE), found {len(parts)}")
            
            # Check ORG code
            if len(parts) > 0 and not (2 <= len(parts[0]) <= 4 and parts[0].isupper() and parts[0].isalpha()):
                violation_details.append(f"ORG code '{parts[0]}' should be 2-4 uppercase letters")
            
            # Check TYPE
            if len(parts) >= 5 and parts[-1] not in ['INT', 'SCH', 'SUB', 'RT']:
                violation_details.append(f"TYPE '{parts[-1]}' must be INT, SCH, SUB, or RT")
            
            # Check for lowercase
            if not name.isupper():
                violation_details.append("All parts must be uppercase")
            
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_integration_name_pattern",
                rule_name="Integration Name Pattern",
                violation=f"Integration '{name}' does not follow OIC naming pattern",
                current_value=name,
                suggested_value=self._suggest_integration_name(name),
                description=f"Integration names must follow: <ORG>_<SRC>_<TGT>_<OBJ>_<TYPE> (or more parts). "
                           f"Issues: {'; '.join(violation_details)}. "
                           f"Examples: BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT, AA_CPQ_TO_ORACLE_SALEORDER_INT"
            ))
        else:
            # Name matches lenient pattern, but check if it follows strict standard (3-4 char ORG)
            if not re.match(self.INTEGRATION_PATTERNS['name_strict'], name):
                parts = name.split('_')
                if len(parts) > 0 and len(parts[0]) == 2:
                    # 2-char ORG code - give a low-priority recommendation
                    issues.append(Issue(
                        file_path=file_path,
                        severity=Severity.LOW,
                        category=Category.NAMING_CONVENTION,
                        rule_id="oic_integration_org_length",
                        rule_name="Organization Code Length Recommendation",
                        violation=f"Integration '{name}' uses 2-character ORG code '{parts[0]}'",
                        current_value=parts[0],
                        suggested_value=f"{parts[0]}X (3 chars recommended)",
                        description="Per OIC naming standards, organization codes should be 3-4 characters. "
                                   "While 2-character codes are accepted, 3-4 characters are recommended for clarity."
                    ))
        
        # Check length
        if len(name) > 50:
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.MEDIUM,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_integration_name_length",
                rule_name="Integration Name Length",
                violation=f"Integration name '{name}' exceeds 50 characters ({len(name)} chars)",
                current_value=name,
                description="Integration names cannot be longer than 50 characters"
            ))
        
        # Check for reserved patterns
        for pattern in self.RESERVED_PATTERNS:
            if re.search(pattern, name, re.IGNORECASE):
                issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.CRITICAL,
                    category=Category.NAMING_CONVENTION,
                    rule_id="oic_reserved_pattern",
                    rule_name="Reserved Pattern in Name",
                    violation=f"Integration name '{name}' contains reserved pattern",
                    current_value=name,
                    description="Names cannot contain reserved patterns: BA, XBA, TA, R"
                ))
        
        return issues
    
    def validate_integration_identifier(self, identifier: str, file_path: str) -> List[Issue]:
        """
        Validate integration identifier against pattern: <ORG>_<SRC>_<TGT>_<OBJ>
        Example: BCRX_3PL_ERP_TRANSACTIONS
        """
        issues = []
        
        if not re.match(self.INTEGRATION_PATTERNS['identifier'], identifier):
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_integration_identifier_pattern",
                rule_name="Integration Identifier Pattern",
                violation=f"Integration identifier '{identifier}' does not follow OIC pattern",
                current_value=identifier,
                suggested_value=self._suggest_integration_identifier(identifier),
                description="Integration identifiers must follow: <ORG>_<SRC>_<TGT>_<OBJ>. "
                           "Example: BCRX_ERP_WMS_ORDERSYNC"
            ))
        
        # Check length (max 32 characters)
        if len(identifier) > 32:
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_identifier_length",
                rule_name="Identifier Length",
                violation=f"Identifier '{identifier}' exceeds 32 characters ({len(identifier)} chars)",
                current_value=identifier,
                description="Identifiers cannot be longer than 32 characters"
            ))
        
        # Must start with letter
        if not identifier[0].isalpha():
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_identifier_start",
                rule_name="Identifier Start Character",
                violation=f"Identifier '{identifier}' must start with a letter",
                current_value=identifier,
                description="Identifiers must start with a letter (A-Z)"
            ))
        
        return issues
    
    def validate_connection_name(self, name: str, file_path: str) -> List[Issue]:
        """
        Validate connection name against pattern: <ORG>_<SYSTEM>_<TYPE>_CONN
        Example: BCRX_SALESFORCE_REST_CONN
        """
        issues = []
        
        if not re.match(self.CONNECTION_PATTERNS['name'], name):
            parts = name.split('_')
            
            violation_details = []
            if not name.endswith('_CONN'):
                violation_details.append("Must end with '_CONN'")
            
            if len(parts) < 4:
                violation_details.append(f"Expected 4 parts, found {len(parts)}")
            
            # Check for valid adapter type
            valid_types = ['REST', 'SOAP', 'FTP', 'DB', 'FILE']
            if len(parts) >= 3 and parts[-2] not in valid_types:
                violation_details.append(f"Adapter type must be one of: {', '.join(valid_types)}")
            
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_connection_name_pattern",
                rule_name="Connection Name Pattern",
                violation=f"Connection '{name}' does not follow OIC naming pattern",
                current_value=name,
                suggested_value=self._suggest_connection_name(name),
                description=f"Connection names must follow: <ORG>_<SYSTEM>_<TYPE>_CONN. "
                           f"Issues: {'; '.join(violation_details)}. "
                           f"Example: BCRX_SALESFORCE_REST_CONN"
            ))
        
        return issues
    
    def validate_lookup_name(self, name: str, file_path: str) -> List[Issue]:
        """
        Validate lookup name against pattern: <ORG>_<SOURCE>_<PURPOSE>_LOOKUP
        Example: BCRX_ERP_CMN_INT_LOOKUP
        """
        issues = []
        
        if not re.match(self.LOOKUP_PATTERNS['name'], name):
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_lookup_name_pattern",
                rule_name="Lookup Name Pattern",
                violation=f"Lookup '{name}' does not follow OIC naming pattern",
                current_value=name,
                suggested_value=f"{name}_LOOKUP" if not name.endswith('_LOOKUP') else name,
                description="Lookup names must follow: <ORG>_<SOURCE>_<PURPOSE>_LOOKUP. "
                           "Example: BCRX_ERP_CMN_INT_LOOKUP"
            ))
        
        return issues
    
    def validate_package_name(self, name: str, file_path: str) -> List[Issue]:
        """
        Validate package name against pattern: com.<ORG>.<PROJECT>.<MODULE>
        Example: com.bcrx.erp.im
        """
        issues = []
        
        if not re.match(self.PACKAGE_PATTERNS['name'], name):
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_package_name_pattern",
                rule_name="Package Name Pattern",
                violation=f"Package '{name}' does not follow OIC naming pattern",
                current_value=name,
                suggested_value=self._suggest_package_name(name),
                description="Package names must follow: com.<org>.<project>.<module> (all lowercase). "
                           "Example: com.bcrx.erp.im"
            ))
        
        # Check for reserved words
        for pattern in self.RESERVED_PATTERNS:
            if re.search(pattern, name, re.IGNORECASE):
                issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.CRITICAL,
                    category=Category.NAMING_CONVENTION,
                    rule_id="oic_package_reserved_pattern",
                    rule_name="Reserved Pattern in Package Name",
                    violation=f"Package name '{name}' contains reserved pattern",
                    current_value=name,
                    description="Package names cannot contain reserved words: ba, xba, ta, r"
                ))
        
        return issues
    
    def validate_project_name(self, name: str, file_path: str) -> List[Issue]:
        """
        Validate project name against pattern: com.<ORG>.<PROJECT>.<MODULE>
        Example: com.bcrx.erp.im
        Note: Projects follow the same naming convention as packages
        """
        issues = []
        
        if not re.match(self.PACKAGE_PATTERNS['name'], name):
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id="oic_project_name_pattern",
                rule_name="Project Name Pattern",
                violation=f"Project '{name}' does not follow OIC naming pattern",
                current_value=name,
                suggested_value=self._suggest_package_name(name),
                description="Project names must follow: com.<org>.<project>.<module> (all lowercase). "
                           "Example: com.bcrx.erp.im"
            ))
        
        # Check for reserved words
        for pattern in self.RESERVED_PATTERNS:
            if re.search(pattern, name, re.IGNORECASE):
                issues.append(Issue(
                    file_path=file_path,
                    severity=Severity.CRITICAL,
                    category=Category.NAMING_CONVENTION,
                    rule_id="oic_project_reserved_pattern",
                    rule_name="Reserved Pattern in Project Name",
                    violation=f"Project name '{name}' contains reserved pattern",
                    current_value=name,
                    description="Project names cannot contain reserved words: ba, xba, ta, r"
                ))
        
        return issues
    
    def validate_action_name(self, action_type: str, name: str, file_path: str) -> List[Issue]:
        """
        Validate OIC action/activity names against specific patterns
        Examples:
        - Assign: Asg_datetime
        - Map: Map to UpdatePhoneNumber
        - Logger: Log_OrderDetails
        - ForEach: ForEach_OrderApproval
        """
        issues = []
        
        pattern = self.ACTION_PATTERNS.get(action_type.lower())
        if not pattern:
            return issues  # No pattern defined for this action type
        
        if not re.match(pattern, name):
            prefix_map = {
                'assign': 'Asg_',
                'map': 'Map to ',
                'logger': 'Log_',
                'foreach': 'ForEach_',
                'switch': 'IF ',
                'notification': 'Notify_<object>_<status>',
                'scope': 'Scp_',
                'while': 'While_<attribute>_<condition>',
                'stagefile': 'Stg_',
                'javascript': 'JS_',
                'wait': 'Wait_',
                'b2b': 'B2b_',
                'datastitch': 'ds_',
            }
            
            expected_prefix = prefix_map.get(action_type.lower(), action_type.title() + '_')
            
            issues.append(Issue(
                file_path=file_path,
                severity=Severity.HIGH,
                category=Category.NAMING_CONVENTION,
                rule_id=f"oic_action_{action_type}_pattern",
                rule_name=f"{action_type.title()} Action Naming Pattern",
                violation=f"{action_type.title()} action '{name}' does not follow OIC naming pattern",
                current_value=name,
                suggested_value=f"{expected_prefix}{name}" if not name.startswith(expected_prefix) else name,
                description=f"{action_type.title()} actions must start with '{expected_prefix}'. "
                           f"Example: {expected_prefix}DescriptiveName"
            ))
        
        return issues
    
    # Helper methods for suggestions
    def _suggest_integration_name(self, name: str) -> str:
        """Suggest a corrected integration name"""
        # Convert to uppercase and replace spaces/dashes with underscores
        suggested = name.upper().replace(' ', '_').replace('-', '_')
        
        # If it doesn't end with a type, suggest adding INT
        if not any(suggested.endswith(t) for t in ['_INT', '_SCH', '_SUB', '_RT']):
            suggested += '_INT'
        
        return suggested
    
    def _suggest_integration_identifier(self, identifier: str) -> str:
        """Suggest a corrected integration identifier"""
        return identifier.upper().replace(' ', '_').replace('-', '_')
    
    def _suggest_connection_name(self, name: str) -> str:
        """Suggest a corrected connection name"""
        suggested = name.upper().replace(' ', '_').replace('-', '_')
        
        if not suggested.endswith('_CONN'):
            suggested += '_CONN'
        
        return suggested
    
    def _suggest_package_name(self, name: str) -> str:
        """Suggest a corrected package name"""
        suggested = name.lower().replace('_', '.').replace(' ', '.')
        
        if not suggested.startswith('com.'):
            suggested = 'com.' + suggested
        
        return suggested


# Singleton instance
oic_naming_validator = OICNamingValidator()

