"""
Name Generator Service
Generates compliant OIC artifact names based on user inputs
"""

from typing import Dict, List, Optional, Any
from .models import ArtifactType


class NameGenerator:
    """Generate compliant artifact names"""
    
    @staticmethod
    def generate_integration_name(
        org_code: str,
        source_system: str,
        target_system: str,
        business_object: str,
        integration_type: str = "INT"
    ) -> Dict[str, Any]:
        """Generate integration name"""
        # Normalize inputs
        org = org_code.upper().strip()
        source = source_system.upper().strip().replace(" ", "_")
        target = target_system.upper().strip().replace(" ", "_")
        obj = business_object.upper().strip().replace(" ", "")
        int_type = integration_type.upper().strip()
        
        # Generate name
        name = f"{org}_{source}_{target}_{obj}_{int_type}"
        identifier = f"{org}_{source}_{target}_{obj}"
        
        return {
            "name": name,
            "identifier": identifier,
            "version": "01.00.0000",
            "components": {
                "organization": org,
                "source": source,
                "target": target,
                "object": obj,
                "type": int_type
            },
            "suggestions": [
                f"Consider using descriptive names for clarity",
                f"Ensure {org} is your organization code (3-4 chars)",
                f"Type {int_type} indicates: INT=Integration, SCH=Scheduled, SUB=Subscription, RT=Real-time"
            ]
        }
    
    @staticmethod
    def generate_connection_name(
        org_code: str,
        adapter_type: str,
        system_name: str
    ) -> Dict[str, Any]:
        """Generate connection name"""
        org = org_code.upper().strip()
        adapter = adapter_type.upper().strip()
        system = system_name.upper().strip().replace(" ", "_")
        
        name = f"{org}_{adapter}_{system}_CONN"
        
        return {
            "name": name,
            "identifier": name,
            "components": {
                "organization": org,
                "adapter": adapter,
                "system": system,
                "suffix": "CONN"
            },
            "suggestions": [
                f"Adapter type {adapter} should be: REST, SOAP, FTP, SFTP, DB, FILE, etc.",
                f"Connection names should be environment-agnostic",
                f"Use descriptive system names"
            ]
        }
    
    @staticmethod
    def generate_lookup_name(
        org_code: str,
        source_system: str,
        purpose: str
    ) -> Dict[str, Any]:
        """Generate lookup name"""
        org = org_code.upper().strip()
        source = source_system.upper().strip().replace(" ", "_")
        purp = purpose.upper().strip().replace(" ", "_")
        
        name = f"{org}_{source}_{purp}_LOOKUP"
        
        return {
            "name": name,
            "identifier": name,
            "components": {
                "organization": org,
                "source": source,
                "purpose": purp,
                "suffix": "LOOKUP"
            },
            "suggestions": [
                f"Purpose should describe the lookup function",
                f"Lookups are reusable across integrations",
                f"Use clear, descriptive names"
            ]
        }
    
    @staticmethod
    def generate_package_name(
        org_code: str,
        project_code: str,
        module: str
    ) -> Dict[str, Any]:
        """Generate package name"""
        org = org_code.lower().strip()
        project = project_code.lower().strip()
        mod = module.lower().strip().replace(" ", "_")
        
        name = f"com.{org}.{project}.{mod}"
        
        return {
            "name": name,
            "identifier": name,
            "components": {
                "prefix": "com",
                "organization": org,
                "project": project,
                "module": mod
            },
            "suggestions": [
                f"Package names must be lowercase",
                f"Use reverse domain notation",
                f"Project code should be 3 characters",
                f"Avoid reserved words: ba, xba, ta, r"
            ]
        }
    
    @staticmethod
    def generate_project_name(
        org_code: str,
        project_code: str,
        module: str
    ) -> Dict[str, Any]:
        """Generate project name (same as package)"""
        return NameGenerator.generate_package_name(org_code, project_code, module)
    
    @staticmethod
    def generate_agent_name(
        org_code: str,
        system_name: str,
        adapter_type: str
    ) -> Dict[str, Any]:
        """Generate agent name"""
        org = org_code.upper().strip()
        system = system_name.upper().strip().replace(" ", "_")
        adapter = adapter_type.upper().strip()
        
        name = f"{org}_{system}_{adapter}_AGENT"
        
        return {
            "name": name,
            "identifier": name,
            "components": {
                "organization": org,
                "system": system,
                "adapter": adapter,
                "suffix": "AGENT"
            },
            "suggestions": [
                f"Agent names identify on-premises connectivity",
                f"Adapter type: DB, SFTP, FTP, etc.",
                f"System name should match the on-prem system"
            ]
        }
    
    @staticmethod
    def generate_library_name(
        org_code: str,
        functionality: str
    ) -> Dict[str, Any]:
        """Generate library name"""
        org = org_code.upper().strip()
        func = functionality.upper().strip().replace(" ", "_")
        
        name = f"{org}_{func}"
        
        return {
            "name": name,
            "identifier": name,
            "version": "01.00.0000",
            "components": {
                "organization": org,
                "functionality": func
            },
            "suggestions": [
                f"Library names can be uppercase or lowercase",
                f"Describe the library's functionality clearly",
                f"JavaScript libraries for reusable functions"
            ]
        }
    
    @staticmethod
    def generate_action_name(
        action_type: str,
        description: str
    ) -> Dict[str, Any]:
        """Generate action name"""
        prefixes = {
            "assign": "Asg",
            "b2b": "B2b",
            "data_stitch": "ds",
            "map": "Map to",
            "stage_file": "sf",
            "variable": "var"
        }
        
        prefix = prefixes.get(action_type.lower(), "Act")
        desc = description.strip().replace(" ", "_")
        
        if action_type.lower() == "map":
            name = f"Map to {description}"
        else:
            name = f"{prefix}_{desc}"
        
        return {
            "name": name,
            "components": {
                "prefix": prefix,
                "description": desc
            },
            "suggestions": [
                f"Action names should be descriptive",
                f"Use appropriate prefix for action type",
                f"Keep names concise but meaningful"
            ]
        }
    
    @staticmethod
    def generate_name(artifact_type: ArtifactType, **kwargs) -> Dict[str, Any]:
        """Generate name based on artifact type"""
        generators = {
            ArtifactType.INTEGRATION: NameGenerator.generate_integration_name,
            ArtifactType.CONNECTION: NameGenerator.generate_connection_name,
            ArtifactType.LOOKUP: NameGenerator.generate_lookup_name,
            ArtifactType.PACKAGE: NameGenerator.generate_package_name,
            ArtifactType.PROJECT: NameGenerator.generate_project_name,
            ArtifactType.AGENT: NameGenerator.generate_agent_name,
            ArtifactType.LIBRARY: NameGenerator.generate_library_name,
            ArtifactType.ACTION: NameGenerator.generate_action_name
        }
        
        generator = generators.get(artifact_type)
        if not generator:
            return {
                "error": f"Generator not implemented for {artifact_type}",
                "name": None
            }
        
        try:
            return generator(**kwargs)
        except Exception as e:
            return {
                "error": f"Failed to generate name: {str(e)}",
                "name": None
            }


