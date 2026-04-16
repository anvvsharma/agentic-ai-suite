"""
Naming Convention Service
Business logic for naming validation
"""

from typing import List, Dict, Any
from .models import (
    ArtifactType, ValidationIssue, NamingValidationResponse,
    BulkValidationItem, BulkValidationResult, BulkValidationResponse
)
from .validators.oic_naming_validator import oic_naming_validator
from ..models import Issue, Severity, Category


class NamingService:
    """Service for naming convention validation"""
    
    def __init__(self):
        self.validator = oic_naming_validator
    
    def validate_artifact_name(self, artifact_type: ArtifactType, name: str) -> NamingValidationResponse:
        """
        Validate an artifact name against OIC naming standards
        
        Args:
            artifact_type: Type of OIC artifact
            name: Name to validate
            
        Returns:
            NamingValidationResponse with validation results
        """
        issues: List[Issue] = []
        
        # Call appropriate validator based on artifact type
        if artifact_type == ArtifactType.INTEGRATION:
            issues = self.validator.validate_integration_name(name, "validation")
        elif artifact_type == ArtifactType.CONNECTION:
            issues = self.validator.validate_connection_name(name, "validation")
        elif artifact_type == ArtifactType.LOOKUP:
            issues = self.validator.validate_lookup_name(name, "validation")
        elif artifact_type == ArtifactType.PACKAGE:
            issues = self.validator.validate_package_name(name, "validation")
        elif artifact_type == ArtifactType.PROJECT:
            issues = self.validator.validate_project_name(name, "validation")
        elif artifact_type == ArtifactType.AGENT:
            # Agent validation not yet implemented in validator
            # Return empty issues for now
            issues = []
        elif artifact_type == ArtifactType.LIBRARY:
            # Library validation not yet implemented in validator
            # Return empty issues for now
            issues = []
        elif artifact_type == ArtifactType.ACTION:
            # For actions, we need action type - default to "invoke"
            issues = self.validator.validate_action_name("invoke", name, "validation")
        
        # Convert issues to ValidationIssue format
        validation_issues = self._convert_issues(issues)
        
        # Determine if valid
        is_valid = len(issues) == 0
        
        # Generate suggestions
        suggestions = self._generate_suggestions(artifact_type, name, issues)
        
        # Get pattern info
        pattern_info = self._get_pattern_info(artifact_type)
        
        return NamingValidationResponse(
            valid=is_valid,
            artifact_type=artifact_type.value,
            name=name,
            issues=validation_issues,
            suggestions=suggestions,
            pattern_info=pattern_info
        )
    
    def validate_bulk(self, items: List[BulkValidationItem]) -> BulkValidationResponse:
        """
        Validate multiple artifacts at once
        
        Args:
            items: List of artifacts to validate
            
        Returns:
            BulkValidationResponse with summary and detailed results
        """
        results: List[BulkValidationResult] = []
        valid_count = 0
        
        for item in items:
            validation = self.validate_artifact_name(item.artifact_type, item.name)
            
            if validation.valid:
                valid_count += 1
            
            results.append(BulkValidationResult(
                artifact_type=item.artifact_type.value,
                name=item.name,
                valid=validation.valid,
                issues_count=len(validation.issues),
                issues=validation.issues
            ))
        
        return BulkValidationResponse(
            total=len(items),
            valid=valid_count,
            invalid=len(items) - valid_count,
            results=results
        )
    
    def _convert_issues(self, issues: List[Issue]) -> List[ValidationIssue]:
        """Convert Issue objects to ValidationIssue format"""
        validation_issues = []
        
        for issue in issues:
            validation_issues.append(ValidationIssue(
                severity=issue.severity.value,
                message=issue.description,
                current_value=issue.current_value or "",
                suggested_value=issue.suggested_value,
                pattern=None,  # Will be added from pattern info
                examples=[]
            ))
        
        return validation_issues
    
    def _generate_suggestions(self, artifact_type: ArtifactType, name: str, issues: List[Issue]) -> List[str]:
        """Generate quick fix suggestions"""
        suggestions = []
        
        # If there are issues with suggested values, use those
        for issue in issues:
            if issue.suggested_value:
                suggestions.append(f"Try: {issue.suggested_value}")
        
        # Add general suggestions based on artifact type
        if not suggestions:
            if artifact_type == ArtifactType.INTEGRATION:
                suggestions.append("Format: <ORG>_<SOURCE>_<TARGET>_<OBJECT>_<TYPE>")
                suggestions.append("Example: BCRX_ERP_CRM_CUSTOMER_INT")
            elif artifact_type == ArtifactType.CONNECTION:
                suggestions.append("Format: <ORG>_<SYSTEM>_<PROTOCOL>_CONN")
                suggestions.append("Example: BCRX_SALESFORCE_REST_CONN")
            elif artifact_type == ArtifactType.PACKAGE:
                suggestions.append("Format: com.<org>.<domain>.<module>")
                suggestions.append("Example: com.bcrx.erp.integration")
        
        return suggestions[:3]  # Limit to 3 suggestions
    
    def _get_pattern_info(self, artifact_type: ArtifactType) -> Dict[str, Any]:
        """Get pattern information and examples for artifact type"""
        patterns = {
            ArtifactType.INTEGRATION: {
                "pattern": "^[A-Z]{3,4}(_[A-Z0-9]+){3,}_(INT|SCH|SUB|RT)$",
                "description": "Integration names must follow: <ORG>_<SOURCE>_<TARGET>_<OBJECT>_<TYPE>",
                "examples": [
                    "BCRX_ERP_CRM_CUSTOMER_INT",
                    "ACME_SFDC_SAP_ORDER_SCH",
                    "CORP_API_DB_TRANSACTION_SUB"
                ],
                "rules": [
                    "Organization code: 3-4 uppercase letters",
                    "Source and target systems: uppercase with underscores",
                    "Type suffix: INT (Integration), SCH (Scheduled), SUB (Subscription), RT (Real-time)"
                ]
            },
            ArtifactType.CONNECTION: {
                "pattern": "^[A-Z]{3,4}_[A-Z0-9]+_(REST|SOAP|FTP|DB|FILE)_CONN$",
                "description": "Connection names must follow: <ORG>_<SYSTEM>_<PROTOCOL>_CONN",
                "examples": [
                    "BCRX_SALESFORCE_REST_CONN",
                    "ACME_SAP_SOAP_CONN",
                    "CORP_ORACLE_DB_CONN"
                ],
                "rules": [
                    "Organization code: 3-4 uppercase letters",
                    "System name: uppercase with underscores",
                    "Protocol: REST, SOAP, FTP, DB, or FILE",
                    "Must end with _CONN"
                ]
            },
            ArtifactType.LOOKUP: {
                "pattern": "^[A-Z]{3,4}_[A-Z0-9]+_[A-Z0-9_]+_LOOKUP$",
                "description": "Lookup names must follow: <ORG>_<DOMAIN>_<NAME>_LOOKUP",
                "examples": [
                    "BCRX_ERP_STATUS_LOOKUP",
                    "ACME_CRM_COUNTRY_LOOKUP",
                    "CORP_HR_DEPARTMENT_LOOKUP"
                ],
                "rules": [
                    "Organization code: 3-4 uppercase letters",
                    "Domain and name: uppercase with underscores",
                    "Must end with _LOOKUP"
                ]
            },
            ArtifactType.PACKAGE: {
                "pattern": "^com\\.[a-z]{3,4}\\.[a-z0-9]+\\.[a-z0-9]+$",
                "description": "Package names must follow: com.<org>.<domain>.<module>",
                "examples": [
                    "com.bcrx.erp.integration",
                    "com.acme.crm.customer",
                    "com.corp.finance.reporting"
                ],
                "rules": [
                    "Must start with 'com.'",
                    "Organization code: 3-4 lowercase letters",
                    "Domain and module: lowercase with dots",
                    "No uppercase letters allowed"
                ]
            },
            ArtifactType.PROJECT: {
                "pattern": "^com\\.[a-z]{3,4}\\.[a-z0-9]+\\.[a-z0-9]+$",
                "description": "Project names follow same convention as packages",
                "examples": [
                    "com.bcrx.erp.im",
                    "com.acme.sales.integration",
                    "com.corp.hr.onboarding"
                ],
                "rules": [
                    "Same rules as packages",
                    "Must start with 'com.'",
                    "All lowercase with dots"
                ]
            },
            ArtifactType.AGENT: {
                "pattern": "^[A-Z]{3,4}_[A-Z0-9]+_AGENT$",
                "description": "Agent names must follow: <ORG>_<NAME>_AGENT",
                "examples": [
                    "BCRX_ONPREM_AGENT",
                    "ACME_DATACENTER_AGENT",
                    "CORP_CLOUD_AGENT"
                ],
                "rules": [
                    "Organization code: 3-4 uppercase letters",
                    "Agent name: uppercase with underscores",
                    "Must end with _AGENT"
                ]
            },
            ArtifactType.LIBRARY: {
                "pattern": "^[A-Z]{3,4}_[A-Z0-9]+_LIB$",
                "description": "Library names must follow: <ORG>_<NAME>_LIB",
                "examples": [
                    "BCRX_COMMON_LIB",
                    "ACME_UTILITIES_LIB",
                    "CORP_SHARED_LIB"
                ],
                "rules": [
                    "Organization code: 3-4 uppercase letters",
                    "Library name: uppercase with underscores",
                    "Must end with _LIB"
                ]
            },
            ArtifactType.ACTION: {
                "pattern": "Various patterns based on action type",
                "description": "Action names vary by type (Invoke, Data, Collection, etc.)",
                "examples": [
                    "InvokeCustomerService",
                    "MapOrderData",
                    "ForEachLineItem"
                ],
                "rules": [
                    "Use PascalCase for action names",
                    "Be descriptive and clear",
                    "Follow action type conventions"
                ]
            }
        }
        
        return patterns.get(artifact_type, {
            "pattern": "No specific pattern defined",
            "description": "Please refer to OIC naming standards documentation",
            "examples": [],
            "rules": []
        })


# Singleton instance
naming_service = NamingService()

