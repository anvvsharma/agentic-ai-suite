# CodeForge Module

Comprehensive code quality and standards enforcement platform with OIC naming conventions validation, code review, and rules management capabilities.

## Overview

The CodeForge module provides a complete solution for maintaining code quality and enforcing naming standards, particularly for Oracle Integration Cloud (OIC) artifacts. It combines intelligent code analysis, pattern-based validation, and flexible rules management in a unified platform.

## Sub-Modules

CodeForge is organized into four specialized sub-modules:

### 1. 📝 Naming Conventions
[Detailed Documentation](naming_conventions/README.md)

OIC artifact naming validation and generation with pattern-based enforcement.

**Key Features:**
- Validate Integration, Connection, Lookup, Package, Project, and Activity names
- Pattern-based validation using regex
- Bulk validation for multiple artifacts
- Auto-generation of compliant names
- Comprehensive naming reports

**API Endpoints:**
```
POST   /api/codeforge/naming/validate
POST   /api/codeforge/naming/validate-bulk
POST   /api/codeforge/naming/generate
GET    /api/codeforge/naming/artifact-types
```

### 2. 🔍 Code Review
[Detailed Documentation](review/README.md)

Multi-language code analysis with severity-based issue categorization.

**Key Features:**
- Python, JavaScript, and OIC integration analysis
- Real-time code quality checks
- Severity levels: Critical, High, Medium, Low, Info
- Category-based organization
- Naming report integration

**API Endpoints:**
```
POST   /api/codeforge/reviews
GET    /api/codeforge/reviews/{id}
GET    /api/codeforge/reviews/{id}/naming-report
```

### 3. 📋 Rules Register
[Detailed Documentation](rules_register/README.md)

Custom rule creation and management with CRUD operations.

**Key Features:**
- Create, read, update, delete rules
- Rule categories and severity levels
- Rule templates
- Validation logic configuration

**API Endpoints:**
```
GET    /api/codeforge/rules
POST   /api/codeforge/rules
GET    /api/codeforge/rules/{id}
PUT    /api/codeforge/rules/{id}
DELETE /api/codeforge/rules/{id}
```

### 4. 📦 Rule Sets
[Detailed Documentation](rule_sets/README.md)

Predefined rule collections for different compliance levels.

**Key Features:**
- OIC Standard, Enterprise, Relaxed rule sets
- Custom rule set creation
- Import/export capabilities
- Rule set versioning

**API Endpoints:**
```
GET    /api/codeforge/rulesets
POST   /api/codeforge/rulesets
GET    /api/codeforge/rulesets/{id}
PUT    /api/codeforge/rulesets/{id}
DELETE /api/codeforge/rulesets/{id}
```

## Module Structure

```
codeforge/
├── __init__.py
├── routes.py                      # Main CodeForge router
├── models.py                      # Shared models
├── README.md                      # This file
│
├── naming_conventions/            # Naming validation & generation
│   ├── __init__.py
│   ├── service.py                 # Business logic
│   ├── routes.py                  # API endpoints
│   ├── models.py                  # Data models
│   ├── generator.py               # Name generation
│   ├── utils.py                   # Utilities
│   ├── README.md                  # Module documentation
│   └── validators/
│       └── oic_naming_validator.py
│
├── review/                        # Code review functionality
│   ├── __init__.py
│   ├── service.py                 # Review logic
│   ├── routes.py                  # API endpoints
│   ├── models.py                  # Data models
│   ├── README.md                  # Module documentation
│   └── reviewers/
│       ├── oic_code_reviewer.py
│       └── python_code_reviewer.py
│
├── rules_register/                # Rule management system
│   ├── __init__.py
│   ├── service.py                 # Rule CRUD operations
│   ├── routes.py                  # API endpoints
│   ├── models.py                  # Data models
│   ├── rule_config.py             # Rule configuration
│   ├── rule_manager.py            # Rule management
│   ├── rule_registry.py           # Rule registry
│   └── README.md                  # Module documentation
│
└── rule_sets/                     # Predefined rule sets
    ├── __init__.py
    ├── service.py                 # Ruleset operations
    ├── routes.py                  # API endpoints
    ├── README.md                  # Module documentation
    └── rulesets/
        ├── oic_standard.json
        ├── oic_enterprise.json
        └── oic_relaxed.json
```

## Common Features

### Shared Models

All sub-modules use common data models defined in `models.py`:

```python
class CodeForgeBase(BaseModel):
    """Base model for CodeForge entities"""
    id: str
    created_at: datetime
    updated_at: datetime

class ValidationResult(BaseModel):
    """Common validation result structure"""
    is_valid: bool
    issues: List[Issue]
    suggestions: List[str]
```

### Error Handling

Consistent error handling across all sub-modules:

```python
class CodeForgeException(Exception):
    """Base exception for CodeForge module"""
    pass

class ValidationException(CodeForgeException):
    """Validation-specific exception"""
    pass

class RuleNotFoundException(CodeForgeException):
    """Rule not found exception"""
    pass
```

### Logging

Structured logging for all operations:

```python
import logging

logger = logging.getLogger("codeforge")
logger.info("Operation completed", extra={"module": "naming", "operation": "validate"})
```

## API Overview

### Base URL
```
http://localhost:8000/api/codeforge
```

### Authentication
Currently, no authentication is required. Future versions will support:
- API key authentication
- OAuth 2.0
- Role-based access control

### Rate Limiting
- Default: 100 requests per minute per IP
- Configurable via environment variables

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {...}
  }
}
```

## Usage Examples

### Naming Validation

```python
from app.codeforge.naming_conventions.service import validate_artifact_name

result = validate_artifact_name(
    artifact_type="integration",
    name="BCRX_SF_ERP_ORDER_INT"
)

if result.is_valid:
    print("Name is compliant")
else:
    print(f"Issues: {result.issues}")
```

### Code Review

```python
from app.codeforge.review.service import create_review

review = create_review(
    code=code_content,
    language="python",
    ruleset_id="oic_standard"
)

print(f"Found {len(review.issues)} issues")
```

### Rules Management

```python
from app.codeforge.rules_register.service import create_rule

rule = create_rule(
    name="No Hardcoded Credentials",
    category="security",
    severity="critical",
    pattern=r"password\s*=\s*['\"].*['\"]"
)
```

## Configuration

### Environment Variables

```env
# CodeForge Configuration
CODEFORGE_ENABLE_CACHING=true
CODEFORGE_CACHE_TTL=3600
CODEFORGE_MAX_FILE_SIZE=10485760  # 10MB
CODEFORGE_ALLOWED_EXTENSIONS=.py,.js,.xml,.iar

# Naming Conventions
NAMING_STRICT_MODE=false
NAMING_CUSTOM_PATTERNS_PATH=./custom_patterns.json

# Code Review
REVIEW_MAX_ISSUES=100
REVIEW_TIMEOUT=30

# Rules
RULES_DB_PATH=./rules.db
RULESETS_PATH=./rulesets/
```

## Performance

### Benchmarks

| Operation | Time | Memory |
|-----------|------|--------|
| Single name validation | <100ms | <10MB |
| Bulk validation (100 items) | <5s | <50MB |
| Code review (1000 lines) | <10s | <100MB |
| Rule creation | <50ms | <5MB |

### Optimization Tips

1. **Use bulk operations** when validating multiple items
2. **Enable caching** for frequently accessed rules
3. **Limit file sizes** to reasonable amounts
4. **Use async operations** for long-running tasks

## Testing

### Unit Tests

```bash
cd backend
pytest unit_test/test_naming_fix.py
pytest unit_test/test_oic_analyzer.py
pytest unit_test/test_rule_system.py
```

### Integration Tests

```bash
cd backend
./integration_test/integration_test.sh
```

### Test Coverage

Current test coverage: **85%+**

## Troubleshooting

### Common Issues

**Issue: Validation fails for valid names**
- Check pattern configuration
- Verify artifact type is correct
- Review custom patterns if enabled

**Issue: Code review timeout**
- Reduce file size
- Increase timeout in configuration
- Check for infinite loops in custom rules

**Issue: Rules not loading**
- Verify rules database path
- Check file permissions
- Ensure JSON format is valid

## Integration

### Frontend Integration

The CodeForge module integrates with the frontend through REST APIs:

```typescript
// TypeScript example
import axios from 'axios';

const validateName = async (artifactType: string, name: string) => {
  const response = await axios.post('/api/codeforge/naming/validate', {
    artifact_type: artifactType,
    name: name
  });
  return response.data;
};
```

### Backend Integration

Other backend modules can import CodeForge services:

```python
from app.codeforge.naming_conventions.service import validate_artifact_name
from app.codeforge.review.service import create_review

# Use in your code
result = validate_artifact_name("integration", "MY_INT")
```

## Extensibility

### Adding New Validators

1. Create validator class in `validators/` directory
2. Implement `validate()` method
3. Register validator in service
4. Add tests

### Adding New Reviewers

1. Create reviewer class in `reviewers/` directory
2. Implement `review()` method
3. Register reviewer for language
4. Add tests

### Custom Rule Sets

1. Create JSON file in `rulesets/` directory
2. Follow rule set schema
3. Load via API or configuration

## Documentation

- **Main README**: [../../../README.md](../../../README.md)
- **Backend README**: [../../README.md](../../README.md)
- **Setup Guide**: [../../../SETUP_GUIDE.md](../../../SETUP_GUIDE.md)
- **Sub-Module Documentation**:
  - [Naming Conventions](naming_conventions/README.md)
  - [Code Review](review/README.md)
  - [Rules Register](rules_register/README.md)
  - [Rule Sets](rule_sets/README.md)

## Contributing

When contributing to CodeForge:

1. Follow Python PEP 8 style guide
2. Add type hints to all functions
3. Write docstrings for public APIs
4. Add unit tests for new features
5. Update documentation

## Support

For issues and questions:
- Check sub-module documentation
- Review API documentation: http://localhost:8000/docs
- Open GitHub issue

---

**Part of the CodeForge AI Engineering Lab**