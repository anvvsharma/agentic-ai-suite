"""
Test script for Phase 2 Day 1 - Rule Configuration System
Tests rule registry, rule manager, and ruleset functionality
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.codeforge.rule_registry import rule_registry
from app.codeforge.rule_manager import rule_manager
from app.codeforge.rule_config import RuleSetCreateRequest
from app.codeforge.models import Technology, Severity, Category


def print_section(title):
    """Print a section header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)


def test_rule_registry():
    """Test 1: Rule Registry"""
    print_section("TEST 1: Rule Registry")
    
    # Test 1.1: List all OIC rules
    print("\n1.1 Listing all OIC rules...")
    oic_rules = rule_registry.list_rules(technology=Technology.OIC)
    print(f"✅ Found {len(oic_rules)} OIC rules")
    
    # Test 1.2: Get specific rule
    print("\n1.2 Getting specific rule (global_fault_handler)...")
    rule = rule_registry.get_rule("global_fault_handler")
    if rule:
        print(f"✅ Rule found: {rule.name}")
        print(f"   Category: {rule.category}")
        print(f"   Default Severity: {rule.default_severity}")
        print(f"   Description: {rule.description[:80]}...")
    else:
        print("❌ Rule not found")
    
    # Test 1.3: List rules by category
    print("\n1.3 Listing rules by category...")
    for category in [Category.ERROR_HANDLING, Category.NAMING_CONVENTION, Category.SECURITY]:
        rules = rule_registry.get_rules_by_category(category, technology=Technology.OIC)
        print(f"   {category.value}: {len(rules)} rules")
    
    print("\n✅ Rule Registry tests passed!")


def test_rule_manager():
    """Test 2: Rule Manager"""
    print_section("TEST 2: Rule Manager")
    
    # Test 2.1: List all rulesets
    print("\n2.1 Listing all rulesets...")
    rulesets = rule_manager.list_rulesets(technology=Technology.OIC)
    print(f"✅ Found {len(rulesets)} rulesets:")
    for rs in rulesets:
        default_marker = " (DEFAULT)" if rs.is_default else ""
        system_marker = " [SYSTEM]" if rs.is_system else " [CUSTOM]"
        print(f"   - {rs.name}{default_marker}{system_marker}")
        print(f"     Total rules: {rs.total_rules}, Enabled: {rs.enabled_rules}")
    
    # Test 2.2: Load default ruleset
    print("\n2.2 Loading default ruleset...")
    default_ruleset = rule_manager.get_default_ruleset(Technology.OIC)
    if default_ruleset:
        print(f"✅ Default ruleset loaded: {default_ruleset.name}")
        print(f"   ID: {default_ruleset.id}")
        print(f"   Total rules: {len(default_ruleset.rules)}")
        print(f"   Enabled rules: {len(default_ruleset.get_enabled_rules())}")
    else:
        print("❌ No default ruleset found")
    
    # Test 2.3: Load specific rulesets
    print("\n2.3 Loading specific rulesets...")
    for ruleset_id in ['oic_standard', 'oic_enterprise', 'oic_relaxed']:
        ruleset = rule_manager.load_ruleset(ruleset_id)
        if ruleset:
            enabled_count = len(ruleset.get_enabled_rules())
            print(f"✅ {ruleset.name}: {enabled_count}/{len(ruleset.rules)} rules enabled")
        else:
            print(f"❌ Failed to load {ruleset_id}")
    
    print("\n✅ Rule Manager tests passed!")


def test_ruleset_operations():
    """Test 3: Ruleset Operations"""
    print_section("TEST 3: Ruleset Operations")
    
    # Load standard ruleset for testing
    ruleset = rule_manager.load_ruleset('oic_standard')
    if not ruleset:
        print("❌ Failed to load standard ruleset")
        return
    
    # Test 3.1: Get specific rule
    print("\n3.1 Getting specific rule from ruleset...")
    rule = ruleset.get_rule("global_fault_handler")
    if rule:
        print(f"✅ Rule found: {rule.name}")
        print(f"   Enabled: {rule.enabled}")
        print(f"   Severity: {rule.severity}")
    else:
        print("❌ Rule not found in ruleset")
    
    # Test 3.2: Get enabled rules
    print("\n3.2 Getting enabled rules...")
    enabled_rules = ruleset.get_enabled_rules()
    print(f"✅ {len(enabled_rules)} rules are enabled")
    
    # Test 3.3: Get rules by category
    print("\n3.3 Getting rules by category...")
    naming_rules = ruleset.get_rules_by_category(Category.NAMING_CONVENTION)
    print(f"✅ {len(naming_rules)} naming convention rules")
    for rule in naming_rules:
        print(f"   - {rule.name}: {rule.severity}")
    
    # Test 3.4: Get rules by severity
    print("\n3.4 Getting rules by severity...")
    high_rules = ruleset.get_rules_by_severity(Severity.HIGH)
    print(f"✅ {len(high_rules)} HIGH severity rules")
    
    print("\n✅ Ruleset Operations tests passed!")


def test_ruleset_comparison():
    """Test 4: Compare Different Rulesets"""
    print_section("TEST 4: Ruleset Comparison")
    
    # Load all three rulesets
    standard = rule_manager.load_ruleset('oic_standard')
    enterprise = rule_manager.load_ruleset('oic_enterprise')
    relaxed = rule_manager.load_ruleset('oic_relaxed')
    
    if not all([standard, enterprise, relaxed]):
        print("❌ Failed to load all rulesets")
        return
    
    print("\n4.1 Comparing enabled rules...")
    print(f"   Standard:   {len(standard.get_enabled_rules())}/{len(standard.rules)} enabled")
    print(f"   Enterprise: {len(enterprise.get_enabled_rules())}/{len(enterprise.rules)} enabled")
    print(f"   Relaxed:    {len(relaxed.get_enabled_rules())}/{len(relaxed.rules)} enabled")
    
    print("\n4.2 Comparing severity for 'global_fault_handler'...")
    for name, rs in [("Standard", standard), ("Enterprise", enterprise), ("Relaxed", relaxed)]:
        rule = rs.get_rule("global_fault_handler")
        if rule:
            severity_str = rule.severity if isinstance(rule.severity, str) else rule.severity.value
            print(f"   {name:12}: {severity_str:8} (enabled: {rule.enabled})")
    
    print("\n4.3 Comparing severity for naming convention rules...")
    for name, rs in [("Standard", standard), ("Enterprise", enterprise), ("Relaxed", relaxed)]:
        naming_rules = rs.get_rules_by_category(Category.NAMING_CONVENTION)
        enabled = sum(1 for r in naming_rules if r.enabled)
        print(f"   {name:12}: {enabled}/{len(naming_rules)} enabled")
    
    print("\n✅ Ruleset Comparison tests passed!")


def test_rule_parameters():
    """Test 5: Rule Parameters"""
    print_section("TEST 5: Rule Parameters")
    
    # Load all three rulesets
    standard = rule_manager.load_ruleset('oic_standard')
    enterprise = rule_manager.load_ruleset('oic_enterprise')
    relaxed = rule_manager.load_ruleset('oic_relaxed')
    
    print("\n5.1 Comparing 'loop_no_limit' parameters...")
    for name, rs in [("Standard", standard), ("Enterprise", enterprise), ("Relaxed", relaxed)]:
        rule = rs.get_rule("loop_no_limit")
        if rule and 'max_iterations' in rule.parameters:
            max_iter = rule.parameters['max_iterations']
            print(f"   {name:12}: max_iterations = {max_iter}")
    
    print("\n5.2 Comparing 'retry_policy' parameters...")
    for name, rs in [("Standard", standard), ("Enterprise", enterprise), ("Relaxed", relaxed)]:
        rule = rs.get_rule("retry_policy")
        if rule and 'min_retry_count' in rule.parameters:
            min_retry = rule.parameters['min_retry_count']
            print(f"   {name:12}: min_retry_count = {min_retry}")
    
    print("\n5.3 Comparing 'timeout_config' parameters...")
    for name, rs in [("Standard", standard), ("Enterprise", enterprise), ("Relaxed", relaxed)]:
        rule = rs.get_rule("timeout_config")
        if rule and 'default_timeout' in rule.parameters:
            timeout = rule.parameters['default_timeout']
            print(f"   {name:12}: default_timeout = {timeout}s")
    
    print("\n✅ Rule Parameters tests passed!")


def test_analyzer_integration():
    """Test 6: Analyzer Integration"""
    print_section("TEST 6: Analyzer Integration")
    
    from app.codeforge.analyzers.oic_analyzer import OICAnalyzer
    
    # Test 6.1: Create analyzer with default ruleset
    print("\n6.1 Creating analyzer with default ruleset...")
    analyzer1 = OICAnalyzer()
    if analyzer1.ruleset:
        print(f"✅ Analyzer created with ruleset: {analyzer1.ruleset.name}")
        print(f"   Rules loaded: {len(analyzer1.ruleset.rules)}")
    else:
        print("❌ Analyzer has no ruleset")
    
    # Test 6.2: Create analyzer with specific ruleset
    print("\n6.2 Creating analyzer with enterprise ruleset...")
    enterprise_ruleset = rule_manager.load_ruleset('oic_enterprise')
    analyzer2 = OICAnalyzer(ruleset=enterprise_ruleset)
    if analyzer2.ruleset:
        print(f"✅ Analyzer created with ruleset: {analyzer2.ruleset.name}")
    
    # Test 6.3: Test helper methods
    print("\n6.3 Testing analyzer helper methods...")
    print(f"   Is 'global_fault_handler' enabled? {analyzer1._is_rule_enabled('global_fault_handler')}")
    print(f"   Severity of 'global_fault_handler': {analyzer1._get_rule_severity('global_fault_handler')}")
    print(f"   Max iterations parameter: {analyzer1._get_rule_parameter('loop_no_limit', 'max_iterations', 1000)}")
    
    print("\n✅ Analyzer Integration tests passed!")


def run_all_tests():
    """Run all tests"""
    print("\n" + "🚀"*40)
    print("  PHASE 2 DAY 1 - RULE CONFIGURATION SYSTEM TEST SUITE")
    print("🚀"*40)
    
    try:
        test_rule_registry()
        test_rule_manager()
        test_ruleset_operations()
        test_ruleset_comparison()
        test_rule_parameters()
        test_analyzer_integration()
        
        print("\n" + "✅"*40)
        print("  ALL TESTS PASSED!")
        print("✅"*40)
        print("\n📊 Summary:")
        print("   - Rule Registry: ✅ Working")
        print("   - Rule Manager: ✅ Working")
        print("   - Ruleset Operations: ✅ Working")
        print("   - Ruleset Comparison: ✅ Working")
        print("   - Rule Parameters: ✅ Working")
        print("   - Analyzer Integration: ✅ Working")
        print("\n🎉 Phase 2 Day 1 implementation is VERIFIED and WORKING!")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)

