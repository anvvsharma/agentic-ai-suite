"""
CodeForge API Routes
"""
import time
import logging
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from datetime import datetime

from .models import (
    Project, ProjectCreate, CodeReview, AnalyzeCodeRequest,
    AnalyzeCodeResponse, ReviewStatus, ReviewSummary, Technology,
    Severity, CodingStandard, StandardsTemplate, Category
)
from .review.reviewers.python_code_reviewer import PythonAnalyzer
from .review.reviewers.oic_code_reviewer import OICAnalyzer
from .rules_register.rule_config import (
    RuleSet, RuleConfig, CreateRuleSetRequest, UpdateRuleSetRequest,
    UpdateRuleRequest, RuleSetListResponse, RuleListResponse,
    RuleMetadata, RuleSetSummary, RuleSetExportFormat, RuleSetImportRequest
)
from .rules_register.rule_registry import rule_registry
from .naming_conventions.routes import router as naming_router
from .rules_register.rule_manager import rule_manager

logger = logging.getLogger(__name__)

router = APIRouter()

# Include naming routes
router.include_router(naming_router)

# In-memory storage (replace with database in production)
projects_db: dict[UUID, Project] = {}
reviews_db: dict[UUID, CodeReview] = {}
standards_db: dict[UUID, CodingStandard] = {}


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "codeforge",
        "version": "1.0.0"
    }


@router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create a new project"""
    new_project = Project(
        id=uuid4(),
        name=project.name,
        technology=project.technology,
        repository_url=project.repository_url,
        description=project.description
    )
    projects_db[new_project.id] = new_project
    logger.info(f"Created project: {new_project.name} ({new_project.id})")
    return new_project


@router.get("/projects", response_model=List[Project])
async def list_projects():
    """List all projects"""
    return list(projects_db.values())


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: UUID):
    """Get project by ID"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects_db[project_id]


@router.post("/analyze", response_model=AnalyzeCodeResponse)
async def analyze_code(request: AnalyzeCodeRequest):
    """
    Analyze code and return issues
    
    Supports:
    - Python
    - JavaScript (coming soon)
    - Java (coming soon)
    """
    start_time = time.time()
    
    # Create or get project
    if request.project_id and request.project_id in projects_db:
        project = projects_db[request.project_id]
    else:
        # Create temporary project
        project = Project(
            id=uuid4(),
            name=f"Quick Analysis - {request.file_name}",
            technology=request.technology
        )
        projects_db[project.id] = project
    
    # Create review
    review = CodeReview(
        id=uuid4(),
        project_id=project.id,
        technology=request.technology,
        status=ReviewStatus.IN_PROGRESS,
        started_at=datetime.utcnow()
    )
    
    try:
        # Analyze based on technology
        naming_report = None
        if request.technology == Technology.PYTHON:
            analyzer = PythonAnalyzer()
            issues = analyzer.analyze(request.code, request.file_name or "untitled.py")
        elif request.technology == Technology.OIC:
            analyzer = OICAnalyzer()
            issues = analyzer.analyze(request.code, request.file_name or "integration.iar")
            # Get naming report for OIC
            naming_report = analyzer.get_naming_report()
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Analysis for {request.technology} is not yet implemented. Currently supported: Python, OIC"
            )
        
        # Calculate summary
        summary = ReviewSummary(
            total_files=1,
            total_lines=len(request.code.split('\n')),
            total_issues=len(issues),
            critical_severity=sum(1 for i in issues if i.severity == Severity.CRITICAL),
            high_severity=sum(1 for i in issues if i.severity == Severity.HIGH),
            medium_severity=sum(1 for i in issues if i.severity == Severity.MEDIUM),
            low_severity=sum(1 for i in issues if i.severity == Severity.LOW),
            info_severity=sum(1 for i in issues if i.severity == Severity.INFO)
        )
        
        # Count issues by category
        for issue in issues:
            category = issue.category.value
            summary.issues_by_category[category] = summary.issues_by_category.get(category, 0) + 1
        
        # Update review
        review.status = ReviewStatus.COMPLETED
        review.summary = summary
        review.issues = issues
        review.naming_report = naming_report
        review.completed_at = datetime.utcnow()
        review.duration_seconds = time.time() - start_time
        
        reviews_db[review.id] = review
        
        logger.info(f"Analysis completed: {len(issues)} issues found in {review.duration_seconds:.2f}s")
        
        return AnalyzeCodeResponse(
            review_id=review.id,
            status=review.status,
            summary=summary,
            issues=issues,
            analysis_time=review.duration_seconds
        )
        
    except Exception as e:
        review.status = ReviewStatus.FAILED
        reviews_db[review.id] = review
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/reviews/{review_id}/naming-report")
async def get_naming_report(review_id: UUID):
    """
    Get naming conventions report for a review
    
    Returns structured data showing ACTUAL vs RULES for all artifacts
    """
    if review_id not in reviews_db:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review = reviews_db[review_id]
    
    # Check if this was an OIC analysis
    if review.technology != Technology.OIC:
        raise HTTPException(
            status_code=400,
            detail="Naming report is only available for OIC analyses"
        )
    
    # Check if naming report exists
    if not review.naming_report:
        raise HTTPException(
            status_code=404,
            detail="Naming report not available for this review"
        )
    
    return review.naming_report


@router.get("/reviews/{review_id}", response_model=CodeReview)
async def get_review(review_id: UUID):
    """Get review by ID"""
    if review_id not in reviews_db:
        raise HTTPException(status_code=404, detail="Review not found")
    return reviews_db[review_id]


@router.get("/reviews", response_model=List[CodeReview])
async def list_reviews(project_id: UUID = None, limit: int = 50):
    """List reviews, optionally filtered by project"""
    reviews = list(reviews_db.values())
    
    if project_id:
        reviews = [r for r in reviews if r.project_id == project_id]
    
    # Sort by created_at descending
    reviews.sort(key=lambda x: x.created_at, reverse=True)
    
    return reviews[:limit]


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    project_id: UUID = None,
    technology: Technology = Technology.PYTHON
):
    """
    Upload a code file for analysis
    Supports both text files and binary .iar packages
    """
    try:
        content = await file.read()
        
        # Handle .iar files (binary ZIP archives)
        if file.filename and file.filename.endswith('.iar'):
            # For .iar files, pass binary content directly
            # The OIC analyzer will handle ZIP extraction
            code = content.decode('latin-1')  # Use latin-1 to preserve binary data
            technology = Technology.OIC
        else:
            # For text files, decode as UTF-8
            try:
                code = content.decode('utf-8')
            except UnicodeDecodeError:
                # Try latin-1 as fallback
                code = content.decode('latin-1')
        
        # Analyze the uploaded file
        request = AnalyzeCodeRequest(
            project_id=project_id,
            technology=technology,
            code=code,
            file_name=file.filename
        )
        
        result = await analyze_code(request)
        
        return {
            "message": "File uploaded and analyzed successfully",
            "file_name": file.filename,
            "review_id": result.review_id,
            "issues_found": result.summary.total_issues,
            "analysis_result": result
        }
        
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/standards", response_model=List[CodingStandard])
async def list_standards(technology: Technology = None):
    """List coding standards templates"""
    standards = list(standards_db.values())
    
    if technology:
        standards = [s for s in standards if s.technology == technology]
    
    return standards


@router.post("/standards", response_model=CodingStandard)
async def create_standard(standard: CodingStandard):
    """Create a new coding standard template"""
    standard.id = uuid4()
    standards_db[standard.id] = standard
    logger.info(f"Created coding standard: {standard.name}")
    return standard


@router.get("/standards/{standard_id}", response_model=CodingStandard)
async def get_standard(standard_id: UUID):
    """Get coding standard by ID"""
    if standard_id not in standards_db:
        raise HTTPException(status_code=404, detail="Standard not found")
    return standards_db[standard_id]


@router.get("/sample-code")
async def get_sample_code():
    """Get sample code for testing"""
    return {
        "python": """
def getData(userName):
    # Get user data
    result = []
    for i in range(100):
        for j in range(100):
            result.append(i * j)
    return result

class userManager:
    def __init__(self):
        self.users = []
    
    def AddUser(self, user):
        self.users.append(user)

MAX_USERS = 100
minUsers = 10
""",
        "javascript": """
function GetData(userName) {
    let result = [];
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            result.push(i * j);
        }
    }
    return result;
}

class UserManager {
    constructor() {
        this.users = [];
    }
    
    AddUser(user) {
        this.users.push(user);
    }
}
"""
    }


@router.get("/stats")
async def get_stats():
    """Get overall statistics"""
    total_reviews = len(reviews_db)
    completed_reviews = sum(1 for r in reviews_db.values() if r.status == ReviewStatus.COMPLETED)
    total_issues = sum(r.summary.total_issues for r in reviews_db.values())
    
    return {
        "total_projects": len(projects_db),
        "total_reviews": total_reviews,
        "completed_reviews": completed_reviews,
        "total_issues_found": total_issues,
        "avg_issues_per_review": total_issues / completed_reviews if completed_reviews > 0 else 0
    }



# ============================================================================
# RULES MANAGEMENT API ENDPOINTS
# ============================================================================

@router.get("/rules", response_model=RuleListResponse)
async def list_all_rules(
    technology: Optional[Technology] = Query(None, description="Filter by technology"),
    category: Optional[Category] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in rule name/description")
):
    """
    List all available rules from the registry
    
    Supports filtering by:
    - Technology (OIC, Python, JavaScript, etc.)
    - Category (Error Handling, Security, etc.)
    - Search term (in name or description)
    """
    # Use list_rules method from registry
    all_rules = rule_registry.list_rules(technology=technology, category=category)
    
    # Apply search filter if provided
    if search:
        search_lower = search.lower()
        all_rules = [
            r for r in all_rules
            if search_lower in r.name.lower() or search_lower in r.description.lower()
        ]
    
    return RuleListResponse(
        rules=all_rules,
        total=len(all_rules)
    )


@router.get("/rules/{rule_id}", response_model=RuleMetadata)
async def get_rule(rule_id: str):
    """Get detailed information about a specific rule"""
    rule = rule_registry.get_rule(rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail=f"Rule '{rule_id}' not found")
    return rule


@router.post("/rules", response_model=RuleMetadata)
async def create_rule(rule: RuleMetadata):
    """
    Create a new rule in the registry
    
    This adds a new rule definition that can be used in rulesets
    """
    # Check if rule_id already exists
    existing_rule = rule_registry.get_rule(rule.rule_id)
    if existing_rule:
        raise HTTPException(
            status_code=400,
            detail=f"Rule with ID '{rule.rule_id}' already exists"
        )
    
    # Register the new rule
    rule_registry.register_rule(rule)
    logger.info(f"Created new rule: {rule.name} ({rule.rule_id})")
    
    return rule


@router.put("/rules/{rule_id}", response_model=RuleMetadata)
async def update_rule(rule_id: str, rule: RuleMetadata):
    """
    Update an existing rule in the registry
    
    Updates the rule definition. Note: This will affect all rulesets using this rule.
    """
    # Check if rule exists
    existing_rule = rule_registry.get_rule(rule_id)
    if not existing_rule:
        raise HTTPException(status_code=404, detail=f"Rule '{rule_id}' not found")
    
    # Ensure rule_id matches
    if rule.rule_id != rule_id:
        raise HTTPException(
            status_code=400,
            detail="Rule ID in path must match rule ID in body"
        )
    
    # Update the rule
    rule_registry.register_rule(rule)
    logger.info(f"Updated rule: {rule.name} ({rule.rule_id})")
    
    return rule


@router.delete("/rules/{rule_id}")
async def delete_rule(rule_id: str):
    """
    Delete a rule from the registry
    
    Warning: This will remove the rule from all rulesets that use it.
    """
    # Check if rule exists
    existing_rule = rule_registry.get_rule(rule_id)
    if not existing_rule:
        raise HTTPException(status_code=404, detail=f"Rule '{rule_id}' not found")
    
    # Remove from registry
    if rule_id in rule_registry._rules:
        del rule_registry._rules[rule_id]
        logger.info(f"Deleted rule: {rule_id}")
        
        return {
            "message": f"Rule '{rule_id}' deleted successfully",
            "rule_id": rule_id
        }
    
    raise HTTPException(status_code=500, detail="Failed to delete rule")



@router.get("/rulesets", response_model=RuleSetListResponse)
async def list_rulesets(
    technology: Optional[Technology] = Query(None, description="Filter by technology")
):
    """
    List all available rulesets
    
    Returns both system rulesets (read-only) and custom user rulesets
    """
    # list_rulesets already returns RuleSetSummary objects
    summaries = rule_manager.list_rulesets(technology=technology)
    
    return RuleSetListResponse(
        rulesets=summaries,
        total=len(summaries)
    )


@router.get("/rulesets/{ruleset_id}", response_model=RuleSet)
async def get_ruleset(ruleset_id: str):
    """Get a specific ruleset with all its rules"""
    ruleset = rule_manager.load_ruleset(ruleset_id)
    if not ruleset:
        raise HTTPException(status_code=404, detail=f"Ruleset '{ruleset_id}' not found")
    return ruleset


@router.post("/rulesets", response_model=RuleSet)
async def create_ruleset(request: CreateRuleSetRequest):
    """
    Create a new custom ruleset
    
    Can optionally clone from an existing ruleset by providing base_ruleset_id
    """
    try:
        # Check if name already exists
        existing = rule_manager.list_rulesets()
        if any(rs.name.lower() == request.name.lower() for rs in existing):
            raise HTTPException(
                status_code=400,
                detail=f"Ruleset with name '{request.name}' already exists"
            )
        
        # Create new ruleset
        if request.base_ruleset_id:
            # Clone from existing
            base_ruleset = rule_manager.load_ruleset(request.base_ruleset_id)
            if not base_ruleset:
                raise HTTPException(
                    status_code=404,
                    detail=f"Base ruleset '{request.base_ruleset_id}' not found"
                )
            
            new_ruleset = RuleSet(
                id=request.name.lower().replace(" ", "_"),
                name=request.name,
                description=request.description,
                technology=request.technology,
                rules=base_ruleset.rules.copy(),
                is_default=False,
                is_system=False
            )
        else:
            # Create empty ruleset
            new_ruleset = RuleSet(
                id=request.name.lower().replace(" ", "_"),
                name=request.name,
                description=request.description,
                technology=request.technology,
                rules=[],
                is_default=False,
                is_system=False
            )
        
        # Save ruleset
        rule_manager.save_ruleset(new_ruleset)
        logger.info(f"Created new ruleset: {new_ruleset.name} ({new_ruleset.id})")
        
        return new_ruleset
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create ruleset: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create ruleset: {str(e)}")


@router.put("/rulesets/{ruleset_id}", response_model=RuleSet)
async def update_ruleset(ruleset_id: str, request: UpdateRuleSetRequest):
    """Update ruleset metadata (name, description)"""
    ruleset = rule_manager.load_ruleset(ruleset_id)
    if not ruleset:
        raise HTTPException(status_code=404, detail=f"Ruleset '{ruleset_id}' not found")
    
    # Update fields
    if request.name:
        ruleset.name = request.name
    if request.description:
        ruleset.description = request.description
    
    ruleset.updated_at = datetime.utcnow()
    
    # Save changes
    rule_manager.save_ruleset(ruleset)
    logger.info(f"Updated ruleset: {ruleset.name} ({ruleset.id}) - System: {ruleset.is_system}")
    
    return ruleset


@router.delete("/rulesets/{ruleset_id}")
async def delete_ruleset(ruleset_id: str, force: bool = Query(False, description="Force delete system ruleset")):
    """Delete a ruleset (custom or system with force=true)"""
    ruleset = rule_manager.load_ruleset(ruleset_id)
    if not ruleset:
        raise HTTPException(status_code=404, detail=f"Ruleset '{ruleset_id}' not found")
    
    # Check if system ruleset without force flag
    if ruleset.is_system and not force:
        raise HTTPException(
            status_code=403,
            detail="Cannot delete system rulesets without force flag. Use force=true to confirm."
        )
    
    # Check if default ruleset
    if ruleset.is_default:
        raise HTTPException(
            status_code=403,
            detail="Cannot delete the default ruleset. Set another ruleset as default first."
        )
    
    # Delete ruleset
    success = rule_manager.delete_ruleset(ruleset_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete ruleset")
    
    logger.info(f"Deleted ruleset: {ruleset.name} ({ruleset.id}) - System: {ruleset.is_system}")
    
    return {"message": f"Ruleset '{ruleset.name}' deleted successfully"}


@router.put("/rulesets/{ruleset_id}/rules/{rule_id}", response_model=RuleConfig)
async def update_rule_in_ruleset(
    ruleset_id: str,
    rule_id: str,
    request: UpdateRuleRequest
):
    """
    Update a specific rule within a ruleset
    
    Can update:
    - enabled: Enable/disable the rule
    - severity: Change severity level
    - parameters: Update rule-specific parameters
    
    Note: System rulesets can be modified (changes will be saved)
    """
    ruleset = rule_manager.load_ruleset(ruleset_id)
    if not ruleset:
        raise HTTPException(status_code=404, detail=f"Ruleset '{ruleset_id}' not found")
    
    # Get the rule
    rule = ruleset.get_rule(rule_id)
    if not rule:
        raise HTTPException(
            status_code=404,
            detail=f"Rule '{rule_id}' not found in ruleset '{ruleset_id}'"
        )
    
    # Update rule
    updates = {}
    if request.enabled is not None:
        updates["enabled"] = request.enabled
    if request.severity is not None:
        updates["severity"] = request.severity
    if request.parameters is not None:
        updates["parameters"] = request.parameters
    
    success = ruleset.update_rule(rule_id, updates)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update rule")
    
    # Save changes
    rule_manager.save_ruleset(ruleset)
    logger.info(f"Updated rule '{rule_id}' in ruleset '{ruleset_id}' - System: {ruleset.is_system}")
    
    # Return updated rule
    updated_rule = ruleset.get_rule(rule_id)
    return updated_rule


@router.post("/rulesets/{ruleset_id}/export")
async def export_ruleset(
    ruleset_id: str,
    format: RuleSetExportFormat = Query(RuleSetExportFormat.JSON, description="Export format")
):
    """
    Export a ruleset to JSON or YAML format
    
    Returns the exported data as a string that can be saved to a file
    """
    ruleset = rule_manager.load_ruleset(ruleset_id)
    if not ruleset:
        raise HTTPException(status_code=404, detail=f"Ruleset '{ruleset_id}' not found")
    
    try:
        # Pass the enum directly, not the value
        exported_data = rule_manager.export_ruleset(ruleset_id, format)
        
        return {
            "ruleset_id": ruleset_id,
            "ruleset_name": ruleset.name,
            "format": format.value,
            "data": exported_data,
            "filename": f"{ruleset_id}.{format.value}"
        }
        
    except Exception as e:
        logger.error(f"Failed to export ruleset: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to export ruleset: {str(e)}")


@router.post("/rulesets/import", response_model=RuleSet)
async def import_ruleset(request: RuleSetImportRequest):
    """
    Import a ruleset from JSON or YAML format
    
    Creates a new custom ruleset from the imported data
    """
    try:
        # Pass the enum directly, not the value
        ruleset = rule_manager.import_ruleset(request.data, request.format)
        
        if not ruleset:
            raise HTTPException(status_code=400, detail="Failed to parse ruleset data")
        
        # Ensure it's not a system ruleset
        ruleset.is_system = False
        ruleset.is_default = False
        
        # Check if name already exists
        existing = rule_manager.list_rulesets()
        if any(rs.id == ruleset.id for rs in existing):
            # Generate unique ID
            base_id = ruleset.id
            counter = 1
            while any(rs.id == f"{base_id}_{counter}" for rs in existing):
                counter += 1
            ruleset.id = f"{base_id}_{counter}"
            ruleset.name = f"{ruleset.name} ({counter})"
        
        # Save imported ruleset
        rule_manager.save_ruleset(ruleset)
        logger.info(f"Imported ruleset: {ruleset.name} ({ruleset.id})")
        
        return ruleset
        
    except Exception as e:
        logger.error(f"Failed to import ruleset: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to import ruleset: {str(e)}")


@router.get("/rulesets/{ruleset_id}/rules", response_model=List[RuleConfig])
async def list_rules_in_ruleset(
    ruleset_id: str,
    enabled_only: bool = Query(False, description="Return only enabled rules")
):
    """Get all rules in a specific ruleset"""
    ruleset = rule_manager.load_ruleset(ruleset_id)
    if not ruleset:
        raise HTTPException(status_code=404, detail=f"Ruleset '{ruleset_id}' not found")
    
    if enabled_only:
        return ruleset.get_enabled_rules()
    return ruleset.rules
