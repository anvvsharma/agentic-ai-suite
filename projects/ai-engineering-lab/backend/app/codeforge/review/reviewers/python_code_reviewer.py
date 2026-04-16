"""
Python Code Analyzer
Analyzes Python code for naming conventions, structure, and best practices
"""
import ast
import re
from typing import List, Dict, Any, Optional
from uuid import uuid4

from ...models import (
    Issue, Severity, Category, NamingConvention,
    CodeStructureRules, StandardsTemplate
)


class PythonAnalyzer:
    """Analyzes Python code against coding standards"""
    
    def __init__(self, standards: Optional[StandardsTemplate] = None):
        self.standards = standards or self._get_default_standards()
        self.issues: List[Issue] = []
        
    def analyze(self, code: str, file_name: str = "untitled.py") -> List[Issue]:
        """
        Analyze Python code and return list of issues
        
        Args:
            code: Python source code
            file_name: Name of the file being analyzed
            
        Returns:
            List of issues found
        """
        self.issues = []
        self.file_name = file_name
        
        try:
            tree = ast.parse(code)
            self._analyze_tree(tree, code)
        except SyntaxError as e:
            self.issues.append(Issue(
                file_path=file_name,
                line_number=e.lineno,
                severity=Severity.HIGH,
                category=Category.CODE_STRUCTURE,
                rule_id="syntax_error",
                rule_name="Syntax Error",
                violation=f"Syntax error: {e.msg}",
                description="Code contains syntax errors and cannot be parsed"
            ))
        
        return self.issues
    
    def _analyze_tree(self, tree: ast.AST, code: str):
        """Analyze AST tree"""
        lines = code.split('\n')
        
        for node in ast.walk(tree):
            # Check function definitions
            if isinstance(node, ast.FunctionDef):
                self._check_function(node, lines)
            
            # Check class definitions
            elif isinstance(node, ast.ClassDef):
                self._check_class(node, lines)
            
            # Check variable assignments
            elif isinstance(node, ast.Assign):
                self._check_variables(node)
            
            # Check constants
            elif isinstance(node, ast.AnnAssign):
                self._check_annotated_assignment(node)
    
    def _check_function(self, node: ast.FunctionDef, lines: List[str]):
        """Check function naming and structure"""
        func_name = node.name
        
        # Skip magic methods
        if func_name.startswith('__') and func_name.endswith('__'):
            return
        
        # Check naming convention
        naming_rule = self.standards.naming_conventions.get('functions')
        if naming_rule:
            if not re.match(naming_rule.pattern, func_name):
                suggested = self._convert_to_snake_case(func_name)
                self.issues.append(Issue(
                    file_path=self.file_name,
                    line_number=node.lineno,
                    severity=Severity.MEDIUM,
                    category=Category.NAMING_CONVENTION,
                    rule_id="function_naming",
                    rule_name="Function Naming Convention",
                    violation=f"Function '{func_name}' violates naming convention",
                    current_value=func_name,
                    suggested_value=suggested,
                    description=f"Python functions should use {naming_rule.case}. Expected pattern: {naming_rule.pattern}"
                ))
        
        # Check function length
        func_length = node.end_lineno - node.lineno + 1
        max_length = self.standards.code_structure.max_function_length
        if func_length > max_length:
            self.issues.append(Issue(
                file_path=self.file_name,
                line_number=node.lineno,
                severity=Severity.LOW,
                category=Category.CODE_STRUCTURE,
                rule_id="function_length",
                rule_name="Function Length",
                violation=f"Function '{func_name}' is too long ({func_length} lines)",
                description=f"Functions should not exceed {max_length} lines. Consider breaking into smaller functions."
            ))
        
        # Check parameter count
        param_count = len(node.args.args)
        max_params = self.standards.code_structure.max_parameters
        if param_count > max_params:
            self.issues.append(Issue(
                file_path=self.file_name,
                line_number=node.lineno,
                severity=Severity.MEDIUM,
                category=Category.CODE_STRUCTURE,
                rule_id="too_many_parameters",
                rule_name="Too Many Parameters",
                violation=f"Function '{func_name}' has too many parameters ({param_count})",
                description=f"Functions should have at most {max_params} parameters. Consider using a config object."
            ))
        
        # Check for docstring
        if not ast.get_docstring(node):
            self.issues.append(Issue(
                file_path=self.file_name,
                line_number=node.lineno,
                severity=Severity.LOW,
                category=Category.DOCUMENTATION,
                rule_id="missing_docstring",
                rule_name="Missing Docstring",
                violation=f"Function '{func_name}' is missing a docstring",
                description="All functions should have docstrings describing their purpose, parameters, and return values."
            ))
    
    def _check_class(self, node: ast.ClassDef, lines: List[str]):
        """Check class naming and structure"""
        class_name = node.name
        
        # Check naming convention
        naming_rule = self.standards.naming_conventions.get('classes')
        if naming_rule:
            if not re.match(naming_rule.pattern, class_name):
                suggested = self._convert_to_pascal_case(class_name)
                self.issues.append(Issue(
                    file_path=self.file_name,
                    line_number=node.lineno,
                    severity=Severity.MEDIUM,
                    category=Category.NAMING_CONVENTION,
                    rule_id="class_naming",
                    rule_name="Class Naming Convention",
                    violation=f"Class '{class_name}' violates naming convention",
                    current_value=class_name,
                    suggested_value=suggested,
                    description=f"Python classes should use {naming_rule.case}. Expected pattern: {naming_rule.pattern}"
                ))
        
        # Check class length
        class_length = node.end_lineno - node.lineno + 1
        max_length = self.standards.code_structure.max_class_length
        if class_length > max_length:
            self.issues.append(Issue(
                file_path=self.file_name,
                line_number=node.lineno,
                severity=Severity.LOW,
                category=Category.CODE_STRUCTURE,
                rule_id="class_length",
                rule_name="Class Length",
                violation=f"Class '{class_name}' is too long ({class_length} lines)",
                description=f"Classes should not exceed {max_length} lines. Consider breaking into smaller classes."
            ))
        
        # Check for docstring
        if not ast.get_docstring(node):
            self.issues.append(Issue(
                file_path=self.file_name,
                line_number=node.lineno,
                severity=Severity.LOW,
                category=Category.DOCUMENTATION,
                rule_id="missing_class_docstring",
                rule_name="Missing Class Docstring",
                violation=f"Class '{class_name}' is missing a docstring",
                description="All classes should have docstrings describing their purpose and usage."
            ))
    
    def _check_variables(self, node: ast.Assign):
        """Check variable naming"""
        for target in node.targets:
            if isinstance(target, ast.Name):
                var_name = target.id
                
                # Check if it's a constant (all uppercase)
                if var_name.isupper():
                    naming_rule = self.standards.naming_conventions.get('constants')
                else:
                    naming_rule = self.standards.naming_conventions.get('variables')
                
                if naming_rule and not re.match(naming_rule.pattern, var_name):
                    suggested = self._convert_to_snake_case(var_name)
                    self.issues.append(Issue(
                        file_path=self.file_name,
                        line_number=node.lineno,
                        severity=Severity.LOW,
                        category=Category.NAMING_CONVENTION,
                        rule_id="variable_naming",
                        rule_name="Variable Naming Convention",
                        violation=f"Variable '{var_name}' violates naming convention",
                        current_value=var_name,
                        suggested_value=suggested,
                        description=f"Variables should use {naming_rule.case}. Expected pattern: {naming_rule.pattern}"
                    ))
    
    def _check_annotated_assignment(self, node: ast.AnnAssign):
        """Check annotated assignments (type hints)"""
        if isinstance(node.target, ast.Name):
            var_name = node.target.id
            
            # Check naming based on whether it's a constant
            if var_name.isupper():
                naming_rule = self.standards.naming_conventions.get('constants')
            else:
                naming_rule = self.standards.naming_conventions.get('variables')
            
            if naming_rule and not re.match(naming_rule.pattern, var_name):
                suggested = self._convert_to_snake_case(var_name) if not var_name.isupper() else var_name
                self.issues.append(Issue(
                    file_path=self.file_name,
                    line_number=node.lineno,
                    severity=Severity.LOW,
                    category=Category.NAMING_CONVENTION,
                    rule_id="variable_naming",
                    rule_name="Variable Naming Convention",
                    violation=f"Variable '{var_name}' violates naming convention",
                    current_value=var_name,
                    suggested_value=suggested,
                    description=f"Variables should use {naming_rule.case}"
                ))
    
    @staticmethod
    def _convert_to_snake_case(name: str) -> str:
        """Convert name to snake_case"""
        # Insert underscore before uppercase letters
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        # Insert underscore before uppercase letters that follow lowercase
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
    
    @staticmethod
    def _convert_to_pascal_case(name: str) -> str:
        """Convert name to PascalCase"""
        # Split by underscore and capitalize each word
        words = name.split('_')
        return ''.join(word.capitalize() for word in words)
    
    @staticmethod
    def _get_default_standards() -> StandardsTemplate:
        """Get default Python coding standards"""
        from ...models import Technology
        
        return StandardsTemplate(
            version="1.0",
            technology=Technology.PYTHON,
            organization="default",
            naming_conventions={
                "variables": NamingConvention(
                    pattern=r"^[a-z_][a-z0-9_]*$",
                    case="snake_case",
                    examples=["user_name", "total_count", "is_valid"]
                ),
                "functions": NamingConvention(
                    pattern=r"^[a-z_][a-z0-9_]*$",
                    case="snake_case",
                    examples=["calculate_total", "get_user_data", "process_request"]
                ),
                "classes": NamingConvention(
                    pattern=r"^[A-Z][a-zA-Z0-9]*$",
                    case="PascalCase",
                    examples=["UserManager", "DataProcessor", "APIClient"]
                ),
                "constants": NamingConvention(
                    pattern=r"^[A-Z][A-Z0-9_]*$",
                    case="UPPER_SNAKE_CASE",
                    examples=["MAX_RETRIES", "API_ENDPOINT", "DEFAULT_TIMEOUT"]
                )
            },
            code_structure=CodeStructureRules(
                max_function_length=50,
                max_class_length=300,
                max_file_length=500,
                max_parameters=5,
                max_nesting_depth=4,
                max_complexity=10
            )
        )

