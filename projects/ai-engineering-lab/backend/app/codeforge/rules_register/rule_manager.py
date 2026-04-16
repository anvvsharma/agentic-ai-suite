"""
Rule Manager for CodeForge
Handles loading, saving, and managing rule sets
"""

import json
import yaml
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime

from .rule_config import (
    RuleSet, RuleConfig, RuleSetSummary, 
    RuleSetCreateRequest, RuleSetUpdateRequest,
    RuleUpdateRequest, RuleSetExportFormat
)
from ..models import Technology, Severity, Category
from .rule_registry import rule_registry


class RuleManager:
    """Manages rule sets - loading, saving, and manipulation"""
    
    def __init__(self, rulesets_dir: Optional[str] = None):
        if rulesets_dir is None:
            # Default to rulesets directory in codeforge package
            self.rulesets_dir = Path(__file__).parent / "rulesets"
        else:
            self.rulesets_dir = Path(rulesets_dir)
        
        self.rulesets_dir.mkdir(parents=True, exist_ok=True)
        self._cache: Dict[str, RuleSet] = {}
    
    def load_ruleset(self, ruleset_id: str) -> Optional[RuleSet]:
        """Load a rule set from storage"""
        # Check cache first
        if ruleset_id in self._cache:
            return self._cache[ruleset_id]
        
        # Try to load from file
        file_path = self.rulesets_dir / f"{ruleset_id}.json"
        if not file_path.exists():
            return None
        
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            ruleset = RuleSet(**data)
            self._cache[ruleset_id] = ruleset
            return ruleset
        except Exception as e:
            print(f"Error loading ruleset {ruleset_id}: {e}")
            return None
    
    def save_ruleset(self, ruleset: RuleSet) -> bool:
        """Save a rule set to storage"""
        try:
            # Update timestamp
            ruleset.updated_at = datetime.utcnow()
            
            # Save to file
            file_path = self.rulesets_dir / f"{ruleset.id}.json"
            with open(file_path, 'w') as f:
                json.dump(ruleset.dict(), f, indent=2, default=str)
            
            # Update cache
            self._cache[ruleset.id] = ruleset
            return True
        except Exception as e:
            print(f"Error saving ruleset {ruleset.id}: {e}")
            return False
    
    def list_rulesets(self, technology: Optional[Technology] = None) -> List[RuleSetSummary]:
        """List all available rule sets"""
        summaries = []
        
        # Scan rulesets directory
        for file_path in self.rulesets_dir.glob("*.json"):
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                
                ruleset = RuleSet(**data)
                
                # Filter by technology if specified
                if technology and ruleset.technology != technology:
                    continue
                
                summary = RuleSetSummary(
                    id=ruleset.id,
                    name=ruleset.name,
                    description=ruleset.description,
                    technology=ruleset.technology,
                    total_rules=len(ruleset.rules),
                    enabled_rules=len(ruleset.get_enabled_rules()),
                    is_default=ruleset.is_default,
                    is_system=ruleset.is_system,
                    created_at=ruleset.created_at,
                    updated_at=ruleset.updated_at
                )
                summaries.append(summary)
            except Exception as e:
                print(f"Error loading ruleset from {file_path}: {e}")
                continue
        
        return summaries
    
    def get_default_ruleset(self, technology: Technology) -> Optional[RuleSet]:
        """Get the default rule set for a technology"""
        rulesets = self.list_rulesets(technology=technology)
        
        for summary in rulesets:
            if summary.is_default:
                return self.load_ruleset(summary.id)
        
        # If no default found, return first available
        if rulesets:
            return self.load_ruleset(rulesets[0].id)
        
        return None
    
    def create_ruleset(self, request: RuleSetCreateRequest, created_by: Optional[str] = None) -> RuleSet:
        """Create a new rule set"""
        # Generate ID from name
        ruleset_id = request.name.lower().replace(" ", "_")
        
        # If base_ruleset_id provided, clone it
        if request.base_ruleset_id:
            base_ruleset = self.load_ruleset(request.base_ruleset_id)
            if base_ruleset:
                # Clone rules from base
                rules = [RuleConfig(**rule.dict()) for rule in base_ruleset.rules]
            else:
                # Create from registry
                rules = self._create_rules_from_registry(request.technology)
        else:
            # Create from registry
            rules = self._create_rules_from_registry(request.technology)
        
        # Create new ruleset
        ruleset = RuleSet(
            id=ruleset_id,
            name=request.name,
            description=request.description,
            technology=request.technology,
            rules=rules,
            is_default=False,
            is_system=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            created_by=created_by
        )
        
        # Save it
        self.save_ruleset(ruleset)
        return ruleset
    
    def update_ruleset(self, ruleset_id: str, request: RuleSetUpdateRequest) -> Optional[RuleSet]:
        """Update a rule set's metadata"""
        ruleset = self.load_ruleset(ruleset_id)
        if not ruleset:
            return None
        
        # Update fields
        if request.name:
            ruleset.name = request.name
        if request.description:
            ruleset.description = request.description
        
        # Save
        self.save_ruleset(ruleset)
        return ruleset
    
    def delete_ruleset(self, ruleset_id: str, force: bool = False) -> bool:
        """Delete a rule set (force=True allows deleting system rulesets)"""
        ruleset = self.load_ruleset(ruleset_id)
        if not ruleset:
            return False
        
        # Don't allow deleting system rulesets without force
        if ruleset.is_system and not force:
            return False
        
        # Delete file
        file_path = self.rulesets_dir / f"{ruleset_id}.json"
        if file_path.exists():
            file_path.unlink()
        
        # Remove from cache
        if ruleset_id in self._cache:
            del self._cache[ruleset_id]
        
        return True
    
    def update_rule(self, ruleset_id: str, rule_id: str, request: RuleUpdateRequest) -> Optional[RuleSet]:
        """Update a specific rule in a rule set"""
        ruleset = self.load_ruleset(ruleset_id)
        if not ruleset:
            return None
        
        # Build updates dict
        updates = {}
        if request.enabled is not None:
            updates['enabled'] = request.enabled
        if request.severity is not None:
            updates['severity'] = request.severity
        if request.parameters is not None:
            updates['parameters'] = request.parameters
        
        # Update rule
        if ruleset.update_rule(rule_id, updates):
            self.save_ruleset(ruleset)
            return ruleset
        
        return None
    
    def export_ruleset(self, ruleset_id: str, format: RuleSetExportFormat = RuleSetExportFormat.JSON) -> Optional[str]:
        """Export a rule set to JSON or YAML"""
        ruleset = self.load_ruleset(ruleset_id)
        if not ruleset:
            return None
        
        data = ruleset.dict()
        
        if format == RuleSetExportFormat.JSON:
            return json.dumps(data, indent=2, default=str)
        elif format == RuleSetExportFormat.YAML:
            return yaml.dump(data, default_flow_style=False)
        
        return None
    
    def import_ruleset(self, data: str, format: RuleSetExportFormat = RuleSetExportFormat.JSON) -> Optional[RuleSet]:
        """Import a rule set from JSON or YAML"""
        try:
            if format == RuleSetExportFormat.JSON:
                ruleset_data = json.loads(data)
            elif format == RuleSetExportFormat.YAML:
                ruleset_data = yaml.safe_load(data)
            else:
                return None
            
            # Create ruleset object
            ruleset = RuleSet(**ruleset_data)
            
            # Mark as non-system
            ruleset.is_system = False
            ruleset.is_default = False
            
            # Save it
            self.save_ruleset(ruleset)
            return ruleset
        except Exception as e:
            print(f"Error importing ruleset: {e}")
            return None
    
    def _create_rules_from_registry(self, technology: Technology) -> List[RuleConfig]:
        """Create rule configurations from registry"""
        rules = []
        
        # Get all rules for this technology from registry
        rule_metadata_list = rule_registry.list_rules(technology=technology)
        
        for metadata in rule_metadata_list:
            rule = RuleConfig(
                rule_id=metadata.rule_id,
                enabled=True,
                severity=metadata.default_severity,
                category=metadata.category,
                name=metadata.name,
                description=metadata.description,
                parameters={},
                tags=[]
            )
            rules.append(rule)
        
        return rules
    
    def clear_cache(self):
        """Clear the ruleset cache"""
        self._cache.clear()


# Global rule manager instance
rule_manager = RuleManager()

