"""
Rule Registry for CodeForge
Central registry of all available rules with their metadata
"""

from typing import Dict, List, Optional
from .rule_config import RuleMetadata, RuleParameter, RuleParameterType
from ..models import Severity, Category, Technology


class RuleRegistry:
    """Central registry for all available rules"""
    
    def __init__(self):
        self._rules: Dict[str, RuleMetadata] = {}
        self._initialize_oic_rules()
    
    def register_rule(self, metadata: RuleMetadata):
        """Register a rule with its metadata"""
        self._rules[metadata.rule_id] = metadata
    
    def get_rule(self, rule_id: str) -> Optional[RuleMetadata]:
        """Get rule metadata by ID"""
        return self._rules.get(rule_id)
    
    def list_rules(self, technology: Optional[Technology] = None, 
                   category: Optional[Category] = None) -> List[RuleMetadata]:
        """List all rules, optionally filtered by technology and/or category"""
        rules = list(self._rules.values())
        
        if technology:
            rules = [r for r in rules if r.technology == technology]
        
        if category:
            rules = [r for r in rules if r.category == category]
        
        return rules
    
    def get_rules_by_category(self, category: Category, 
                             technology: Optional[Technology] = None) -> List[RuleMetadata]:
        """Get all rules in a specific category"""
        return self.list_rules(technology=technology, category=category)
    
    def _initialize_oic_rules(self):
        """Initialize OIC-specific rules"""
        
        # ERROR HANDLING RULES
        self.register_rule(RuleMetadata(
            rule_id="global_fault_handler",
            name="Global Fault Handler",
            description="Integration must have a global fault handler to catch unexpected errors",
            category=Category.ERROR_HANDLING,
            default_severity=Severity.CRITICAL,
            technology=Technology.OIC,
            examples=[
                "Add a global fault handler scope at the integration level",
                "Configure fault policies for common error scenarios"
            ],
            references=[
                "https://docs.oracle.com/en/cloud/paas/integration-cloud/error-handling.html"
            ]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="scope_fault_handler",
            name="Scope Fault Handler",
            description="Critical scopes should have dedicated fault handlers",
            category=Category.ERROR_HANDLING,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["Add fault handler to scope containing external service calls"]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="retry_policy",
            name="Retry Policy Configuration",
            description="Service invocations should have retry policies configured",
            category=Category.ERROR_HANDLING,
            default_severity=Severity.MEDIUM,
            technology=Technology.OIC,
            available_parameters=[
                RuleParameter(
                    name="min_retry_count",
                    type=RuleParameterType.INTEGER,
                    default=3,
                    description="Minimum number of retries required",
                    min_value=1,
                    max_value=10
                )
            ]
        ))
        
        # LOGGING RULES
        self.register_rule(RuleMetadata(
            rule_id="logging_activity",
            name="Logging Activity",
            description="Integration should include logging activities for debugging",
            category=Category.LOGGING,
            default_severity=Severity.MEDIUM,
            technology=Technology.OIC,
            available_parameters=[
                RuleParameter(
                    name="min_log_count",
                    type=RuleParameterType.INTEGER,
                    default=2,
                    description="Minimum number of log activities required",
                    min_value=1,
                    max_value=20
                )
            ]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="correlation_id",
            name="Correlation ID Tracking",
            description="Integration should track correlation IDs for request tracing",
            category=Category.LOGGING,
            default_severity=Severity.MEDIUM,
            technology=Technology.OIC
        ))
        
        # PERFORMANCE RULES
        self.register_rule(RuleMetadata(
            rule_id="loop_no_limit",
            name="Loop Iteration Limit",
            description="Loops should have maximum iteration limits to prevent infinite loops",
            category=Category.PERFORMANCE,
            default_severity=Severity.LOW,
            technology=Technology.OIC,
            available_parameters=[
                RuleParameter(
                    name="max_iterations",
                    type=RuleParameterType.INTEGER,
                    default=1000,
                    description="Maximum allowed iterations",
                    min_value=10,
                    max_value=10000
                )
            ]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="timeout_config",
            name="Timeout Configuration",
            description="Service invocations should have appropriate timeout values",
            category=Category.PERFORMANCE,
            default_severity=Severity.LOW,
            technology=Technology.OIC,
            available_parameters=[
                RuleParameter(
                    name="default_timeout",
                    type=RuleParameterType.INTEGER,
                    default=120,
                    description="Default timeout in seconds",
                    min_value=10,
                    max_value=600
                )
            ]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="pagination_support",
            name="Pagination Support",
            description="Large data queries should implement pagination",
            category=Category.PERFORMANCE,
            default_severity=Severity.LOW,
            technology=Technology.OIC
        ))
        
        # SECURITY RULES
        self.register_rule(RuleMetadata(
            rule_id="hardcoded_credentials",
            name="Hardcoded Credentials",
            description="No hardcoded credentials should be present in the integration",
            category=Category.SECURITY,
            default_severity=Severity.CRITICAL,
            technology=Technology.OIC
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="https_endpoints",
            name="HTTPS Endpoints",
            description="All external endpoints should use HTTPS protocol",
            category=Category.SECURITY,
            default_severity=Severity.HIGH,
            technology=Technology.OIC
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="input_validation",
            name="Input Validation",
            description="Input data should be validated before processing",
            category=Category.SECURITY,
            default_severity=Severity.HIGH,
            technology=Technology.OIC
        ))
        
        # DESIGN PATTERN RULES
        self.register_rule(RuleMetadata(
            rule_id="large_integration",
            name="Large Integration Modularization",
            description="Large integrations should be broken down into reusable sub-integrations",
            category=Category.DESIGN_PATTERN,
            default_severity=Severity.MEDIUM,
            technology=Technology.OIC,
            available_parameters=[
                RuleParameter(
                    name="max_activities",
                    type=RuleParameterType.INTEGER,
                    default=20,
                    description="Maximum activities before suggesting modularization",
                    min_value=10,
                    max_value=100
                )
            ]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="reusability_opportunity",
            name="Reusability Opportunity",
            description="Repeated logic should be extracted into reusable components",
            category=Category.DESIGN_PATTERN,
            default_severity=Severity.MEDIUM,
            technology=Technology.OIC
        ))
        
        # DOCUMENTATION RULES
        self.register_rule(RuleMetadata(
            rule_id="integration_description",
            name="Integration Description",
            description="Integration should have a clear description",
            category=Category.DOCUMENTATION,
            default_severity=Severity.LOW,
            technology=Technology.OIC
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="connection_documentation",
            name="Connection Documentation",
            description="Connections should be documented with purpose and configuration",
            category=Category.DOCUMENTATION,
            default_severity=Severity.LOW,
            technology=Technology.OIC
        ))
        
        # NAMING CONVENTION RULES
        self.register_rule(RuleMetadata(
            rule_id="integration_naming",
            name="Integration Naming Convention",
            description="Integration names should follow UPPER_SNAKE_CASE convention",
            category=Category.NAMING_CONVENTION,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["SALES_ORDER_SYNC", "CUSTOMER_DATA_LOAD"]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="connection_naming",
            name="Connection Naming Convention",
            description="Connection names should be descriptive and include _CONN suffix",
            category=Category.NAMING_CONVENTION,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["ERP_DB_CONN", "SFDC_REST_CONN"]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="lookup_suffix",
            name="Lookup Naming Convention",
            description="Lookup names should include _LKP or _LOOKUP suffix",
            category=Category.NAMING_CONVENTION,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["STATUS_CODE_LKP", "COUNTRY_MAP_LKP"]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="mapping_suffix",
            name="Mapping Naming Convention",
            description="Mapping names should include _MAP or _XFORM suffix",
            category=Category.NAMING_CONVENTION,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["ORDER_TRANSFORM_MAP", "CUSTOMER_DATA_XFORM"]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="scope_naming",
            name="Scope Naming Convention",
            description="Scope names should start with 'Scope_' prefix",
            category=Category.NAMING_CONVENTION,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["Scope_ErrorHandling", "Scope_DataProcessing"]
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="activity_naming",
            name="Activity Naming Convention",
            description="Activity names should follow type-specific prefixes",
            category=Category.NAMING_CONVENTION,
            default_severity=Severity.HIGH,
            technology=Technology.OIC,
            examples=["Assign_OrderTotal", "Map_CustomerData", "Log_ProcessStart"]
        ))
        
        # CODE STRUCTURE RULES
        self.register_rule(RuleMetadata(
            rule_id="xml_validation",
            name="XML Structure Validation",
            description="Integration XML should be well-formed and valid",
            category=Category.CODE_STRUCTURE,
            default_severity=Severity.CRITICAL,
            technology=Technology.OIC
        ))
        
        self.register_rule(RuleMetadata(
            rule_id="package_structure",
            name="Package Structure",
            description="Integration package should follow standard structure",
            category=Category.CODE_STRUCTURE,
            default_severity=Severity.MEDIUM,
            technology=Technology.OIC
        ))


# Global registry instance
rule_registry = RuleRegistry()

