"""
CodeForge Data Models
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from uuid import UUID, uuid4


class Severity(str, Enum):
    """Issue severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class Category(str, Enum):
    """Issue categories"""
    NAMING_CONVENTION = "naming_convention"
    CODE_STRUCTURE = "code_structure"
    DESIGN_PATTERN = "design_pattern"
    PERFORMANCE = "performance"
    SECURITY = "security"
    ERROR_HANDLING = "error_handling"
    LOGGING = "logging"
    DOCUMENTATION = "documentation"


class Technology(str, Enum):
    """Supported technologies"""
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    NODEJS = "nodejs"
    NEXTJS = "nextjs"
    JAVA = "java"
    PLSQL = "plsql"
    OIC = "oic"


class ReviewStatus(str, Enum):
    """Code review status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


# Request/Response Models

class ProjectCreate(BaseModel):
    """Create project request"""
    name: str = Field(..., min_length=1, max_length=255)
    technology: Technology
    repository_url: Optional[str] = None
    description: Optional[str] = None


class Project(BaseModel):
    """Project model"""
    id: UUID = Field(default_factory=uuid4)
    name: str
    technology: Technology
    repository_url: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class Issue(BaseModel):
    """Code issue model"""
    id: UUID = Field(default_factory=uuid4)
    file_path: str
    line_number: Optional[int] = None
    column_number: Optional[int] = None
    severity: Severity
    category: Category
    rule_id: str
    rule_name: str
    violation: str
    current_value: Optional[str] = None
    suggested_value: Optional[str] = None
    description: str
    code_snippet: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ReviewSummary(BaseModel):
    """Review summary statistics"""
    total_files: int = 0
    total_lines: int = 0
    total_issues: int = 0
    critical_severity: int = 0
    high_severity: int = 0
    medium_severity: int = 0
    low_severity: int = 0
    info_severity: int = 0
    issues_by_category: Dict[str, int] = Field(default_factory=dict)


class CodeReview(BaseModel):
    """Code review model"""
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    technology: Technology
    status: ReviewStatus = ReviewStatus.PENDING
    summary: ReviewSummary = Field(default_factory=ReviewSummary)
    issues: List[Issue] = Field(default_factory=list)
    naming_report: Optional[Dict[str, Any]] = None  # Store naming conventions report
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class CodingStandard(BaseModel):
    """Coding standard template"""
    id: UUID = Field(default_factory=uuid4)
    name: str
    technology: Technology
    version: str = "1.0.0"
    description: Optional[str] = None
    template: Dict[str, Any]
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Rule(BaseModel):
    """Code review rule"""
    id: str
    name: str
    category: Category
    severity: Severity
    technology: Technology
    description: str
    pattern: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UploadFileRequest(BaseModel):
    """File upload request"""
    project_id: UUID
    technology: Technology
    file_name: str
    file_content: str


class AnalyzeCodeRequest(BaseModel):
    """Analyze code request"""
    project_id: Optional[UUID] = None
    technology: Technology
    code: str
    file_name: Optional[str] = "untitled"
    standards_id: Optional[UUID] = None


class AnalyzeCodeResponse(BaseModel):
    """Analyze code response"""
    review_id: UUID
    status: ReviewStatus
    summary: ReviewSummary
    issues: List[Issue]
    analysis_time: float


class ReportExportRequest(BaseModel):
    """Report export request"""
    review_id: UUID
    format: str = Field(..., pattern="^(pdf|csv|json)$")
    include_code_snippets: bool = True


# Naming Convention Models

class NamingConvention(BaseModel):
    """Naming convention rule"""
    pattern: str
    case: str  # snake_case, camelCase, PascalCase, UPPER_SNAKE_CASE
    examples: List[str] = Field(default_factory=list)
    prefix_rules: Optional[List[Dict[str, str]]] = None
    suffix_rules: Optional[List[Dict[str, str]]] = None


class CodeStructureRules(BaseModel):
    """Code structure rules"""
    max_function_length: int = 50
    max_class_length: int = 300
    max_file_length: int = 500
    max_parameters: int = 5
    max_nesting_depth: int = 4
    max_complexity: int = 10


class StandardsTemplate(BaseModel):
    """Complete standards template"""
    version: str = "1.0"
    technology: Technology
    organization: str = "default"
    naming_conventions: Dict[str, NamingConvention]
    code_structure: CodeStructureRules
    design_patterns: Dict[str, Any] = Field(default_factory=dict)
    error_handling: Dict[str, Any] = Field(default_factory=dict)
    logging: Dict[str, Any] = Field(default_factory=dict)
    security: Dict[str, Any] = Field(default_factory=dict)
    performance: Dict[str, Any] = Field(default_factory=dict)

