"""
Naming Convention API Routes
Endpoints for naming validation
"""

from fastapi import APIRouter, HTTPException
from .models import (
    NamingValidationRequest, NamingValidationResponse,
    BulkValidationRequest, BulkValidationResponse
)
from .service import naming_service

router = APIRouter(prefix="/naming", tags=["naming"])


@router.post("/validate", response_model=NamingValidationResponse)
async def validate_artifact_name(request: NamingValidationRequest):
    """
    Validate a single artifact name against OIC naming standards
    
    Args:
        request: Validation request with artifact type and name
        
    Returns:
        Validation response with issues and suggestions
    """
    try:
        result = naming_service.validate_artifact_name(
            artifact_type=request.artifact_type,
            name=request.name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")


@router.post("/validate-bulk", response_model=BulkValidationResponse)
async def validate_bulk(request: BulkValidationRequest):
    """
    Validate multiple artifact names at once
    
    Args:
        request: Bulk validation request with list of artifacts
        
    Returns:
        Bulk validation response with summary and detailed results
    """
    try:
        result = naming_service.validate_bulk(items=request.items)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk validation failed: {str(e)}")


@router.get("/artifact-types")
async def get_artifact_types():
    """
    Get list of supported artifact types
    
    Returns:
        List of artifact types with descriptions
    """
    return {
        "artifact_types": [
            {"value": "integration", "label": "Integration", "description": "OIC Integration flows"},
            {"value": "connection", "label": "Connection", "description": "Connection to external systems"},
            {"value": "lookup", "label": "Lookup", "description": "Lookup tables for data mapping"},
            {"value": "package", "label": "Package", "description": "Package for grouping integrations"},
            {"value": "project", "label": "Project", "description": "Project container"},
            {"value": "agent", "label": "Agent", "description": "On-premise connectivity agent"},
            {"value": "library", "label": "Library", "description": "Reusable library"},
            {"value": "action", "label": "Action", "description": "OIC action/activity"}
        ]
    }


@router.post("/generate")
async def generate_artifact_name(
    artifact_type: str,
    org_code: str | None = None,
    source_system: str | None = None,
    target_system: str | None = None,
    business_object: str | None = None,
    integration_type: str = "INT",
    adapter_type: str | None = None,
    system_name: str | None = None,
    purpose: str | None = None,
    project_code: str | None = None,
    module: str | None = None,
    functionality: str | None = None,
    action_type: str | None = None,
    description: str | None = None
):
    """
    Generate a compliant artifact name based on inputs
    
    Args:
        artifact_type: Type of artifact to generate name for
        Various parameters specific to each artifact type
        
    Returns:
        Generated name with components and suggestions
    """
    from .generator import NameGenerator
    from .models import ArtifactType
    
    try:
        art_type = ArtifactType(artifact_type)
        
        # Build params dict based on artifact type
        params = {}
        if art_type == ArtifactType.INTEGRATION:
            params = {
                "org_code": org_code,
                "source_system": source_system,
                "target_system": target_system,
                "business_object": business_object,
                "integration_type": integration_type or "INT"
            }
        elif art_type == ArtifactType.CONNECTION:
            params = {
                "org_code": org_code,
                "adapter_type": adapter_type,
                "system_name": system_name
            }
        elif art_type == ArtifactType.LOOKUP:
            params = {
                "org_code": org_code,
                "source_system": source_system,
                "purpose": purpose
            }
        elif art_type in [ArtifactType.PACKAGE, ArtifactType.PROJECT]:
            params = {
                "org_code": org_code,
                "project_code": project_code,
                "module": module
            }
        elif art_type == ArtifactType.AGENT:
            params = {
                "org_code": org_code,
                "system_name": system_name,
                "adapter_type": adapter_type
            }
        elif art_type == ArtifactType.LIBRARY:
            params = {
                "org_code": org_code,
                "functionality": functionality
            }
        elif art_type == ArtifactType.ACTION:
            params = {
                "action_type": action_type,
                "description": description
            }
        
        result = NameGenerator.generate_name(art_type, **params)
        
        if result.get("error"):
            raise HTTPException(status_code=400, detail=result["error"])
            
        return result
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid artifact type: {artifact_type}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Name generation failed: {str(e)}")

