"""
Test script for OIC Analyzer
Tests the comprehensive analysis capabilities
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.codeforge.analyzers.oic_analyzer import OICAnalyzer
from app.codeforge.models import Severity, Category

def test_oic_analyzer():
    """Test OIC analyzer with sample XML"""
    
    # Read sample XML
    with open('test_oic_sample.xml', 'r') as f:
        xml_content = f.read()
    
    # Create analyzer
    analyzer = OICAnalyzer()
    
    # Analyze
    print("🔍 Analyzing OIC Integration...")
    print("=" * 80)
    issues = analyzer.analyze(xml_content, "test_oic_sample.xml")
    
    # Print statistics
    print(f"\n📊 Analysis Statistics:")
    print(f"   Total Issues Found: {len(issues)}")
    
    # Count by severity
    severity_counts = {}
    for issue in issues:
        severity_counts[issue.severity] = severity_counts.get(issue.severity, 0) + 1
    
    print(f"\n   By Severity:")
    for severity in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO]:
        count = severity_counts.get(severity, 0)
        if count > 0:
            print(f"      {severity.value.upper()}: {count}")
    
    # Count by category
    category_counts = {}
    for issue in issues:
        category_counts[issue.category] = category_counts.get(issue.category, 0) + 1
    
    print(f"\n   By Category:")
    for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"      {category.value}: {count}")
    
    # Print integration stats
    print(f"\n📈 Integration Statistics:")
    print(f"   Global Fault Handler: {'✅' if analyzer.integration_stats['has_global_fault_handler'] else '❌'}")
    print(f"   Scopes: {analyzer.integration_stats['scope_count']}")
    print(f"   Scopes with Fault Handlers: {analyzer.integration_stats['scopes_with_fault_handlers']}")
    print(f"   Log Activities: {analyzer.integration_stats['log_activities']}")
    print(f"   External Invocations: {analyzer.integration_stats['external_invocations']}")
    print(f"   Retry Configurations: {analyzer.integration_stats['retry_configurations']}")
    print(f"   Correlation ID Usage: {'✅' if analyzer.integration_stats['correlation_id_usage'] else '❌'}")
    print(f"   Hardcoded Credentials: {len(analyzer.integration_stats['hardcoded_credentials'])}")
    print(f"   HTTP Endpoints: {len(analyzer.integration_stats['http_endpoints'])}")
    print(f"   HTTPS Endpoints: {len(analyzer.integration_stats['https_endpoints'])}")
    print(f"   Loops: {analyzer.integration_stats['loop_count']}")
    
    # Print detailed issues
    print(f"\n🔴 Detailed Issues:")
    print("=" * 80)
    
    for i, issue in enumerate(issues, 1):
        print(f"\n{i}. [{issue.severity.value.upper()}] {issue.rule_name}")
        print(f"   Category: {issue.category.value}")
        print(f"   File: {issue.file_path}")
        print(f"   Violation: {issue.violation}")
        if issue.current_value:
            print(f"   Current: {issue.current_value}")
        if issue.suggested_value:
            print(f"   Suggested: {issue.suggested_value}")
        print(f"   Description: {issue.description}")
    
    print("\n" + "=" * 80)
    print("✅ Analysis Complete!")
    
    # Verify expected issues
    print(f"\n🧪 Verification:")
    expected_checks = {
        'Global Fault Handler': any('global_fault_handler' in issue.rule_id for issue in issues),
        'Hardcoded Credentials': any('hardcoded_credentials' in issue.rule_id for issue in issues),
        'HTTP Endpoint': any('http_endpoint' in issue.rule_id for issue in issues),
        'Sensitive Data in Logs': any('sensitive_data_in_logs' in issue.rule_id for issue in issues),
        'Loop Without Limit': any('loop_no_limit' in issue.rule_id for issue in issues),
        'Missing Timeout': any('no_timeout' in issue.rule_id for issue in issues),
        'Scope Fault Handler': any('scope_fault_handler' in issue.rule_id for issue in issues),
        'Missing Retry': any('missing_retry' in issue.rule_id for issue in issues),
        'Insufficient Logging': any('insufficient_logging' in issue.rule_id for issue in issues),
        'No Correlation ID': any('no_correlation_id' in issue.rule_id for issue in issues),
        'Integration Naming': any('integration_naming' in issue.rule_id for issue in issues),
        'Connection Suffix': any('connection_suffix' in issue.rule_id for issue in issues),
        'Lookup Suffix': any('lookup_suffix' in issue.rule_id for issue in issues),
    }
    
    for check, found in expected_checks.items():
        status = '✅' if found else '❌'
        print(f"   {status} {check}")
    
    all_passed = all(expected_checks.values())
    if all_passed:
        print(f"\n🎉 All expected checks passed!")
    else:
        print(f"\n⚠️  Some checks were not detected")
    
    return issues

if __name__ == "__main__":
    test_oic_analyzer()

