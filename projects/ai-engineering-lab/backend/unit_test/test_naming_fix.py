#!/usr/bin/env python3
"""Test script to verify naming convention and duplicate issue fixes"""

import re

# Test 1: Extract integration name from file path
def extract_integration_name(file_path):
    """Extract integration name from file path, removing version and extension"""
    base_name = file_path.split('/')[-1]  # Get filename
    base_name = base_name.replace('.iar', '').replace('.xml', '')
    # Remove version pattern (e.g., _04.00.0000)
    integration_name = re.sub(r'_\d{2}\.\d{2}\.\d{4}$', '', base_name)
    return integration_name

# Test 2: Validate integration name pattern
def validate_integration_name(name):
    """Validate integration name against OIC pattern (lenient - accepts 2-4 char ORG, 3+ middle parts)"""
    pattern = r'^[A-Z]{2,4}(_[A-Z0-9]+){3,}_(INT|SCH|SUB|RT)$'
    return bool(re.match(pattern, name))

# Run tests
print("=" * 60)
print("Testing Naming Convention Fixes")
print("=" * 60)

# Test case from screenshot
test_file = "AA_CPQ_TO_ORACLE_SALEORDER_INT_04.00.0000.iar"
extracted_name = extract_integration_name(test_file)
is_valid = validate_integration_name(extracted_name)

print(f"\nTest File: {test_file}")
print(f"Extracted Name: {extracted_name}")
print(f"Is Valid: {is_valid}")
print(f"Expected: AA_CPQ_TO_ORACLE_SALEORDER_INT")
print(f"Match: {extracted_name == 'AA_CPQ_TO_ORACLE_SALEORDER_INT'}")

# Additional test cases
test_cases = [
    ("BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT_01.00.0000.iar", "BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT", True),
    ("ABC_SRC_TGT_OBJ_SCH_02.05.1234.iar", "ABC_SRC_TGT_OBJ_SCH", True),
    ("INVALID_NAME.iar", "INVALID_NAME", False),
    ("AA_CPQ_TO_ORACLE_SALEORDER_INT.xml", "AA_CPQ_TO_ORACLE_SALEORDER_INT", True),
]

print("\n" + "=" * 60)
print("Additional Test Cases")
print("=" * 60)

for file_path, expected_name, expected_valid in test_cases:
    extracted = extract_integration_name(file_path)
    is_valid = validate_integration_name(extracted)
    status = "✓" if (extracted == expected_name and is_valid == expected_valid) else "✗"
    print(f"\n{status} File: {file_path}")
    print(f"  Extracted: {extracted} (expected: {expected_name})")
    print(f"  Valid: {is_valid} (expected: {expected_valid})")

print("\n" + "=" * 60)
print("Testing Duplicate Prevention")
print("=" * 60)

# Simulate duplicate detection
issues = []
reported_ids = set()

def add_issue_once(rule_id, message):
    """Add issue only if not already reported"""
    if rule_id not in reported_ids:
        reported_ids.add(rule_id)
        issues.append((rule_id, message))
        return True
    return False

# Try to add same issue multiple times
print("\nAttempting to add 'no_correlation_id' issue 8 times:")
for i in range(8):
    added = add_issue_once("no_correlation_id", "No correlation ID usage detected")
    print(f"  Attempt {i+1}: {'Added' if added else 'Skipped (duplicate)'}")

print(f"\nTotal issues added: {len(issues)} (expected: 1)")
print(f"Status: {'✓ PASS' if len(issues) == 1 else '✗ FAIL'}")

print("\n" + "=" * 60)
print("All Tests Complete")
print("=" * 60)
