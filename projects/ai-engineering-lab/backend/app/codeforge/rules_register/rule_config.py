"""
Rule Configuration Models for CodeForge
Supports configurable rules with customizable severity levels and parameters
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum

from ..models import Severity, Category, Technology


class RuleParameterType(str, Enum):
    """Types of rule parameters"""
    INTEGER = "integer"
    STRING = "string"
    BOOLEAN = "boolean"
    LIST = "list"
    FLOAT = "float"


class RuleParameter(BaseModel):
    """Definition of a configurable rule parameter"""
    name: str
    type: RuleParameterType
    default: Any
    description: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    allowed_values: Optional[List[Any]] = None
    
    class Config:
        use_enum_values = True


class RuleConfig(BaseModel):
    """Configuration for a single rule"""
    rule_id: str = Field(..., description="Unique rule identifier")
    enabled: bool = Field(default=True, description="Whether rule is enabled")
    severity: Severity = Field(..., description="Severity level for violations")
    category: Category = Field(..., description="Rule category")
    name: str = Field(..., description="Human-readable rule name")
    description: str = Field(..., description="Rule description")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Rule-specific parameters")
    tags: List[str] = Field(default_factory=list, description="Tags for filtering")
    
    class Config:
        use_enum_values = True


class RuleMetadata(BaseModel):
    """Metadata about a rule (for registry)"""
    rule_id: str
    name: str
    description: str
    category: Category
    default_severity: Severity
    technology: Technology
    available_parameters: List[RuleParameter] = Field(default_factory=list)
    examples: List[str] = Field(default_factory=list)
    references: List[str] = Field(default_factory=list)
    
    class Config:
        use_enum_values = True


class RuleSet(BaseModel):
    """A collection of rule configurations"""
    id: str = Field(..., description="Unique ruleset identifier")
    name: str = Field(..., description="Ruleset name")
    description: str = Field(..., description="Ruleset description")
    technology: Technology = Field(..., description="Target technology")
    rules: List[RuleConfig] = Field(default_factory=list, description="Rule configurations")
    is_default: bool = Field(default=False, description="Whether this is the default ruleset")
    is_system: bool = Field(default=False, description="Whether this is a system ruleset (read-only)")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    
    class Config:
        use_enum_values = True
    
    def get_rule(self, rule_id: str) -> Optional[RuleConfig]:
        """Get a specific rule configuration"""
        for rule in self.rules:
            if rule.rule_id == rule_id:
                return rule
        return None
    
    def update_rule(self, rule_id: str, updates: Dict[str, Any]) -> bool:
        """Update a specific rule configuration"""
        for i, rule in enumerate(self.rules):
            if rule.rule_id == rule_id:
                # Update fields
                for key, value in updates.items():
                    if hasattr(rule, key):
                        setattr(rule, key, value)
                self.updated_at = datetime.utcnow()
                return True
        return False
    
    def enable_rule(self, rule_id: str) -> bool:
        """Enable a specific rule"""
        return self.update_rule(rule_id, {"enabled": True})
    
    def disable_rule(self, rule_id: str) -> bool:
        """Disable a specific rule"""
        return self.update_rule(rule_id, {"enabled": False})
    
    def set_rule_severity(self, rule_id: str, severity: Severity) -> bool:
        """Set severity for a specific rule"""
        return self.update_rule(rule_id, {"severity": severity})
    
    def get_enabled_rules(self) -> List[RuleConfig]:
        """Get all enabled rules"""
        return [rule for rule in self.rules if rule.enabled]
    
    def get_rules_by_category(self, category: Category) -> List[RuleConfig]:
        """Get all rules in a specific category"""
        return [rule for rule in self.rules if rule.category == category]
    
    def get_rules_by_severity(self, severity: Severity) -> List[RuleConfig]:
        """Get all rules with a specific severity"""
        return [rule for rule in self.rules if rule.severity == severity]


class RuleSetSummary(BaseModel):
    """Summary information about a ruleset"""
    id: str
    name: str
    description: str
    technology: Technology
    total_rules: int
    enabled_rules: int
    is_default: bool
    is_system: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        use_enum_values = True


class RuleSetCreateRequest(BaseModel):
    """Request to create a new ruleset"""
    name: str
    description: str
    technology: Technology
    base_ruleset_id: Optional[str] = None  # Clone from existing ruleset
    
    class Config:
        use_enum_values = True


class RuleSetUpdateRequest(BaseModel):
    """Request to update a ruleset"""
    name: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        use_enum_values = True


class RuleUpdateRequest(BaseModel):
    """Request to update a specific rule"""
    enabled: Optional[bool] = None
    severity: Optional[Severity] = None
    parameters: Optional[Dict[str, Any]] = None
    
    class Config:
        use_enum_values = True


class RuleSetExportFormat(str, Enum):
    """Export formats for rulesets"""
    JSON = "json"
    YAML = "yaml"


class RuleSetImportRequest(BaseModel):
    """Request to import a ruleset"""
    data: str
    format: RuleSetExportFormat = RuleSetExportFormat.JSON
    
    class Config:
        use_enum_values = True


class RuleSetListResponse(BaseModel):
    """Response containing list of rulesets"""
    rulesets: List[RuleSetSummary]
    total: int


class RuleListResponse(BaseModel):
    """Response containing list of rules"""
    rules: List[RuleMetadata]
    total: int


# Aliases for backward compatibility
CreateRuleSetRequest = RuleSetCreateRequest
UpdateRuleSetRequest = RuleSetUpdateRequest
UpdateRuleRequest = RuleUpdateRequest

