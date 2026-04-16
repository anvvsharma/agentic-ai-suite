"""
Naming Convention Models
Request and response models for naming validation API
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class ArtifactType(str, Enum):
    """OIC Artifact Types"""
    INTEGRATION = "integration"
    CONNECTION = "connection"
    LOOKUP = "lookup"
    PACKAGE = "package"
    PROJECT = "project"
    AGENT = "agent"
    LIBRARY = "library"
    ACTION = "action"


class ValidationIssue(BaseModel):
    """Single validation issue"""
    severity: str = Field(..., description="Issue severity: critical, high, medium, low")
    message: str = Field(..., description="Issue description")
    current_value: str = Field(..., description="Current artifact name")
    suggested_value: Optional[str] = Field(None, description="Suggested correction")
    pattern: Optional[str] = Field(None, description="Expected pattern")
    examples: Optional[List[str]] = Field(default_factory=list, description="Example valid names")


class NamingValidationRequest(BaseModel):
    """Request to validate artifact name"""
    artifact_type: ArtifactType = Field(..., description="Type of OIC artifact")
    name: str = Field(..., description="Artifact name to validate", min_length=1, max_length=200)


class NamingValidationResponse(BaseModel):
    """Response from naming validation"""
    valid: bool = Field(..., description="Whether the name is valid")
    artifact_type: str = Field(..., description="Type of artifact validated")
    name: str = Field(..., description="Name that was validated")
    issues: List[ValidationIssue] = Field(default_factory=list, description="List of validation issues")
    suggestions: List[str] = Field(default_factory=list, description="Quick suggestions for fixing")
    pattern_info: Optional[Dict[str, Any]] = Field(None, description="Pattern information and examples")


class BulkValidationItem(BaseModel):
    """Single item in bulk validation"""
    artifact_type: ArtifactType
    name: str


class BulkValidationRequest(BaseModel):
    """Request to validate multiple artifacts"""
    items: List[BulkValidationItem] = Field(..., description="List of artifacts to validate")


class BulkValidationResult(BaseModel):
    """Result for single artifact in bulk validation"""
    artifact_type: str
    name: str
    valid: bool
    issues_count: int
    issues: List[ValidationIssue]


class BulkValidationResponse(BaseModel):
    """Response from bulk validation"""
    total: int = Field(..., description="Total artifacts validated")
    valid: int = Field(..., description="Number of valid artifacts")
    invalid: int = Field(..., description="Number of invalid artifacts")
    results: List[BulkValidationResult] = Field(..., description="Detailed results for each artifact")

