#!/usr/bin/env python3
"""
Test the ACTUAL vs RULES summary report
"""

import sys
sys.path.insert(0, '/Users/veerabhadra.sharma/my_work_space/10_Projects/Code/my-bob-project/ai-engineering-lab_v2/backend')

from app.codeforge.analyzers.oic_analyzer import OICAnalyzer

# Simulate an OIC project.xml with various artifacts
test_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<project name="project_1" package="com.bcrx.erp.im">
    <integration name="AA_CPQ_TO_ORACLE_SALEORDER_INT" identifier="AA_CPQ_TO_ORACLE_SALEORDER" version="01.00.0000"/>
    <integration name="BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT" identifier="BCRX_3PL_ERP_TRANSACTIONS" version="01.00.0000"/>
    <connection name="AGI_CPQ_RESTUR_CONNEC_TEST3" type="REST"/>
    <connection name="BCRX_SALESFORCE_REST_CONN" type="REST"/>
    <connection name="AGI_ATP_DEV_DB_CON" type="DB"/>
    <lookup name="BCRX_ERP_CMN_INT_LOOKUP"/>
    <lookup name="invalid_lookup"/>
</project>
'''

print("\n" + "="*80)
print("TESTING: ACTUAL vs RULES SUMMARY REPORT")
print("="*80)
print("\nAnalyzing test OIC package...")
print("-" * 80)

analyzer = OICAnalyzer()
issues = analyzer.analyze(test_xml, "test_package.xml")

print(f"\n✓ Analysis complete!")
print(f"  Total issues found: {len(issues)}")
print(f"  Naming convention issues: {len([i for i in issues if i.category.value == 'naming_convention'])}")

