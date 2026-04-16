# Backend Test Organization

This directory structure organizes all test-related files for the DevForge AI Platform backend.

## Directory Structure

```
backend/
├── unit_test/              # Unit tests for individual components
├── integration_test/       # Integration tests for API endpoints
└── utilities_test/         # Test utilities, sample data, and documentation
```

## Unit Tests (`unit_test/`)

Contains unit tests for testing individual components in isolation.

### Files:
- `test_naming_fix.py` - Tests for naming convention fixes
- `test_oic_analyzer.py` - Tests for OIC code analyzer
- `test_rule_system.py` - Tests for rule system functionality
- `test_summary_report.py` - Tests for summary report generation

### Running Unit Tests:
```bash
cd backend
python unit_test/test_naming_fix.py
python unit_test/test_oic_analyzer.py
python unit_test/test_rule_system.py
python unit_test/test_summary_report.py
```

## Integration Tests (`integration_test/`)

Contains integration tests that verify the entire API works correctly.

### Files:
- `integration_test.sh` - Comprehensive API endpoint testing script

### Running Integration Tests:
```bash
cd backend
bash integration_test/integration_test.sh
```

This will test:
- ✅ Root endpoint
- ✅ API Health check
- ✅ CodeForge Health check
- ✅ Naming validation
- ✅ Name generation
- ✅ Artifact types listing
- ✅ Rules listing
- ✅ Rulesets listing
- ✅ Sample data retrieval
- ✅ Simple route calculation

## Utilities (`utilities_test/`)

Contains test utilities, sample data, and documentation.

### Files:
- `test_oic_sample.xml` - Sample OIC integration XML for testing
- `README.md` - This documentation file

## Test Coverage

### Naming Conventions
- Artifact name validation
- Name generation
- Pattern matching
- Bulk validation

### Code Review
- OIC integration analysis
- Python code review
- Rule application
- Issue detection

### Rule System
- Rule registration
- Rule configuration
- Ruleset management
- Rule validation

### API Endpoints
- All REST endpoints
- Request/response validation
- Error handling
- Health checks

## Adding New Tests

### For Unit Tests:
1. Create test file in `unit_test/` directory
2. Follow naming convention: `test_<feature>.py`
3. Update this README with test description

### For Integration Tests:
1. Add test cases to `integration_test.sh`
2. Or create new integration test script
3. Document the test scenarios

### For Test Utilities:
1. Add sample data or utilities to `utilities_test/`
2. Document the purpose and usage

## Test Requirements

Tests use the same dependencies as the main application.
Ensure virtual environment is activated:
```bash
source venv/bin/activate  # or use the v1 venv
```

## CI/CD Integration

These tests should be run as part of the CI/CD pipeline:
1. Before deployment
2. After code changes
3. On pull requests
4. Scheduled daily runs

## Best Practices

1. **Unit Tests**: Test individual functions/classes in isolation
2. **Integration Tests**: Test complete workflows and API endpoints
3. **Keep tests independent**: Each test should be able to run standalone
4. **Use descriptive names**: Test names should clearly indicate what they test
5. **Clean up after tests**: Ensure tests don't leave side effects

## Running All Tests

To run all tests in sequence:
```bash
cd backend

# Run unit tests
for test in unit_test/test_*.py; do
    echo "Running $test..."
    python "$test"
done

# Run integration tests
bash integration_test/integration_test.sh
```

## Test Results

All tests should pass before merging code changes. If any test fails:
1. Review the error message
2. Fix the underlying issue
3. Re-run the tests
4. Ensure all tests pass before proceeding