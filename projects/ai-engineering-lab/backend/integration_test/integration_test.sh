#!/bin/bash

echo "🧪 Backend Integration Test Suite"
echo "=================================="
echo ""

BASE_URL="http://localhost:8000"
PASSED=0
FAILED=0

test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
        echo "✅ PASSED (HTTP $status_code)"
        ((PASSED++))
    else
        echo "❌ FAILED (HTTP $status_code)"
        ((FAILED++))
    fi
}

# Test endpoints
test_endpoint "Root" "GET" "/"
test_endpoint "API Health" "GET" "/api/health"
test_endpoint "CodeForge Health" "GET" "/api/codeforge/health"
test_endpoint "Naming Validation" "POST" "/api/codeforge/naming/validate" '{"artifact_type":"integration","name":"TEST_ERP_CRM_CUSTOMER_INT"}'
test_endpoint "Name Generation" "POST" "/api/codeforge/naming/generate?artifact_type=integration&org_code=BCRX&source_system=ERP&target_system=CRM&business_object=CUSTOMER"
test_endpoint "Artifact Types" "GET" "/api/codeforge/naming/artifact-types"
test_endpoint "Rules List" "GET" "/api/codeforge/rules"
test_endpoint "Rulesets List" "GET" "/api/codeforge/rulesets"
test_endpoint "Sample Data" "GET" "/api/sample-data"
test_endpoint "Simple Route" "POST" "/api/simple-route" '{"origin_lat":37.7749,"origin_lon":-122.4194,"destination_lat":37.7849,"destination_lon":-122.4094}'

echo ""
echo "=================================="
echo "Results: $PASSED passed, $FAILED failed"
echo "=================================="

if [ $FAILED -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "❌ Some tests failed"
    exit 1
fi
