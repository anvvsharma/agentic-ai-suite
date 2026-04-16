'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, ArrowLeft, ChevronDown, ChevronRight, Search, FileCode, Database, Package, FolderTree, Server, Puzzle, Code } from 'lucide-react'

interface PatternSection {
  id: string
  title: string
  icon: any
  pattern: string
  description: string
  rules: string[]
  examples: string[]
  fields?: {
    name: string
    convention: string
    guidelines: string
    example: string
  }[]
}

export default function PatternGuidePage() {
  const [expandedSection, setExpandedSection] = useState<string>('integrations')
  const [searchQuery, setSearchQuery] = useState('')

  const patterns: PatternSection[] = [
    {
      id: 'integrations',
      title: 'Integrations',
      icon: FileCode,
      pattern: '<ORG>_<SOURCE>_<TARGET>_<OBJECT>_<TYPE>',
      description: 'Integration names must follow a structured format with organization code, source system, target system, business object, and integration type.',
      rules: [
        'Organization code: 3-4 uppercase letters (e.g., BCRX, ACME)',
        'Source and target systems: uppercase with underscores',
        'Business object: descriptive name in uppercase',
        'Type suffix: INT (Integration), SCH (Scheduled), SUB (Subscription), RT (Real-time)',
        'All parts must be uppercase',
        'Use underscores (_) as separators',
        'Cannot be longer than 50 characters',
        'Must start with a letter'
      ],
      examples: [
        'BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT',
        'BCRX_3PL_ERP_IMPORTTRANSACTIONS_SCH',
        'ACME_SFDC_SAP_ORDER_INT',
        'CORP_API_DB_TRANSACTION_SUB'
      ],
      fields: [
        {
          name: 'Name',
          convention: '<ORG>_<SOURCE>_<TARGET>_<OBJECT>_<TYPE>',
          guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9), spaces, and special characters (_ -). Cannot be longer than 50 chars and must start with a letter.',
          example: 'BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT'
        },
        {
          name: 'Identifier',
          convention: '<ORG>_<SOURCE>_<TARGET>_<OBJECT>',
          guidelines: 'Enter the code using letters (A-Z), numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters, can\'t have pattern *-(BA|XBA|TA|R)-* and must start with letters.',
          example: 'BCRX_3PL_ERP_TRANSACTIONS'
        },
        {
          name: 'Version',
          convention: 'major.minor.patch (xx.xx.xxxx)',
          guidelines: 'Initial version: 01.00.0000. Major: extensive changes, no backward compatibility. Minor: enhancements with backward compatibility. Patch: defect fixes.',
          example: '01.00.0000'
        }
      ]
    },
    {
      id: 'connections',
      title: 'Connections',
      icon: Database,
      pattern: '<ORG>_<ADAPTER>_<SYSTEM>_CONN',
      description: 'Connection names define information about application instances being integrated.',
      rules: [
        'Organization code: 3-4 uppercase letters',
        'Adapter type: REST, SFTP, SOAP, DB, etc.',
        'System name: descriptive system identifier',
        'Must end with _CONN suffix',
        'All parts must be uppercase',
        'Environment agnostic (no DEV, PROD, etc.)',
        'Cannot be longer than 50 characters'
      ],
      examples: [
        'BCRX_SFTP_3PL_CONN',
        'BCRX_REST_ERP_CONN',
        'ACME_SOAP_CRM_CONN',
        'CORP_DB_WAREHOUSE_CONN'
      ],
      fields: [
        {
          name: 'Name',
          convention: '<ORG>_<ADAPTER>_<SYSTEM>_CONN',
          guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9), spaces, and special characters (_ -). Cannot be longer than 50 chars.',
          example: 'BCRX_SFTP_3PL_CONN'
        },
        {
          name: 'Identifier',
          convention: '<ORG>_<ADAPTER>_<SYSTEM>_CONN',
          guidelines: 'Should remain same across environments. Do not specify environment types (DEV, PROD, etc.).',
          example: 'BCRX_REST_ERP_CONN'
        }
      ]
    },
    {
      id: 'lookups',
      title: 'Lookups',
      icon: Search,
      pattern: '<ORG>_<SOURCE>_<PURPOSE>_LOOKUP',
      description: 'Lookups create reusable tables that map different terms used across applications.',
      rules: [
        'Organization code: 3-4 uppercase letters',
        'Source system identifier',
        'Purpose: descriptive name of lookup function',
        'Must end with _LOOKUP suffix',
        'All parts must be uppercase',
        'Cannot be longer than 50 characters'
      ],
      examples: [
        'BCRX_ERP_CMN_INT_LOOKUP',
        'ACME_CRM_STATUS_LOOKUP',
        'CORP_HR_DEPARTMENT_LOOKUP'
      ],
      fields: [
        {
          name: 'Name',
          convention: '<ORG>_<SOURCE>_<PURPOSE>_LOOKUP',
          guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9), spaces, and special characters (_ -). Cannot be longer than 50 chars.',
          example: 'BCRX_ERP_CMN_INT_LOOKUP'
        }
      ]
    },
    {
      id: 'packages',
      title: 'Packages',
      icon: Package,
      pattern: 'com.<org>.<project>.<module>',
      description: 'Packages group related integrations for easy import/export and deployment.',
      rules: [
        'Must be all lowercase',
        'Use dot notation (reverse domain style)',
        'Organization code: 3-4 characters',
        'Project/track code: 3 characters',
        'Module: descriptive module name',
        'Cannot have pattern *.(ba|xba|ta|r).*',
        'Cannot be longer than 50 characters',
        'Must start with letters'
      ],
      examples: [
        'com.bcrx.erp.im',
        'com.acme.crm.sales',
        'com.corp.hr.payroll'
      ],
      fields: [
        {
          name: 'Package',
          convention: 'com.<org>.<project>.<module>',
          guidelines: 'Enter a name using letters (a-z), numbers (0-9) and special characters (_ - .). Must be lowercase.',
          example: 'com.bcrx.erp.im'
        }
      ]
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: FolderTree,
      pattern: 'com.<org>.<project>.<module>',
      description: 'Projects provide a single workspace for designing, managing, and monitoring integrations.',
      rules: [
        'Must be all lowercase',
        'Use dot notation (reverse domain style)',
        'Organization code: 3-4 characters',
        'Project/track code: 3 characters',
        'Module: descriptive module name',
        'Cannot have pattern *.(ba|xba|ta|r).*',
        'Cannot be longer than 50 characters',
        'Must start with letters'
      ],
      examples: [
        'com.bcrx.erp.im',
        'com.acme.crm.integration',
        'com.corp.finance.reporting'
      ],
      fields: [
        {
          name: 'Project',
          convention: 'com.<org>.<project>.<module>',
          guidelines: 'Enter a name using letters (a-z), numbers (0-9) and special characters (_ - .). Must be lowercase.',
          example: 'com.bcrx.erp.im'
        }
      ]
    },
    {
      id: 'agents',
      title: 'Agents',
      icon: Server,
      pattern: '<ORG>_<SYSTEM>_<ADAPTER>_AGENT',
      description: 'On-premises connectivity agents for connecting to systems behind firewalls.',
      rules: [
        'Organization code: 3-4 uppercase letters',
        'System name: source system identifier',
        'Adapter type: DB, SFTP, etc.',
        'Must end with _AGENT suffix',
        'All parts must be uppercase',
        'Cannot be longer than 50 characters'
      ],
      examples: [
        'BCRX_EBS_DB_AGENT',
        'BCRX_ERP_SFTP_AGENT',
        'ACME_ONPREM_DB_AGENT'
      ],
      fields: [
        {
          name: 'Name',
          convention: '<ORG>_<SYSTEM>_<ADAPTER>_AGENT',
          guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9), spaces, and special characters (_ -). Cannot be longer than 50 chars.',
          example: 'BCRX_EBS_DB_AGENT'
        },
        {
          name: 'Identifier',
          convention: '<ORG>_<SYSTEM>_<ADAPTER>_AGENT',
          guidelines: 'Enter the code using letters (A-Z), numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters.',
          example: 'BCRX_ERP_SFTP_AGENT'
        }
      ]
    },
    {
      id: 'libraries',
      title: 'Libraries',
      icon: Code,
      pattern: '<ORG>_<FUNCTIONALITY>',
      description: 'JavaScript libraries for reusable functions in integrations.',
      rules: [
        'Organization code: 3-4 letters (uppercase or lowercase)',
        'Functionality: descriptive name of library purpose',
        'Can be uppercase or lowercase',
        'Use underscores for separation',
        'Cannot be longer than 50 characters',
        'Must start with a letter'
      ],
      examples: [
        'BCRX_DATETIME_FORMATTER',
        'bcrx_datetime_formatter',
        'ACME_STRING_UTILS',
        'corp_data_validator'
      ],
      fields: [
        {
          name: 'Name',
          convention: '<ORG>_<FUNCTIONALITY>',
          guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9), spaces, and special characters (_ -). Can be uppercase or lowercase.',
          example: 'BCRX_DATETIME_FORMATTER'
        },
        {
          name: 'Identifier',
          convention: '<ORG>_<FUNCTIONALITY>',
          guidelines: 'Enter the code using letters (A-Z), numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters.',
          example: 'bcrx_datetime_formatter'
        },
        {
          name: 'Version',
          convention: 'major.minor.patch (xx.xx.xxxx)',
          guidelines: 'Initial version should start with 01.00.0000',
          example: '01.00.0000'
        }
      ]
    },
    {
      id: 'actions',
      title: 'OIC Actions',
      icon: Puzzle,
      pattern: '<PREFIX>_<description>',
      description: 'Naming conventions for various actions in orchestrated integrations.',
      rules: [
        'Assign: Asg_<element_name>',
        'B2B: B2b_<element_name>',
        'Data Stitch: ds_<element_name>',
        'Map: Map to <endpoint>',
        'Stage File: sf_<operation>_<filename>',
        'Variables: var_<element_name>',
        'All names must be descriptive',
        'Cannot start with numbers',
        'Cannot be longer than 50 characters'
      ],
      examples: [
        'Asg_datetime',
        'B2b_Translate_IncomingPurchaseOrder',
        'ds_orderdetails',
        'Map to UpdatePhoneNumber',
        'sf_read_customer_data',
        'var_datetime'
      ]
    }
  ]

  const filteredPatterns = patterns.filter(pattern =>
    pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.pattern.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? '' : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/code-forge/naming-conventions" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Pattern Reference Guide</h1>
          </div>
          <p className="text-indigo-100">
            Comprehensive reference for all OIC naming patterns and conventions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patterns, descriptions, or examples..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pattern Sections */}
        <div className="space-y-4">
          {filteredPatterns.map((pattern) => {
            const Icon = pattern.icon
            const isExpanded = expandedSection === pattern.id

            return (
              <div key={pattern.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(pattern.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">{pattern.title}</h3>
                      <code className="text-sm text-indigo-600 font-mono">{pattern.pattern}</code>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{pattern.description}</p>
                    </div>

                    {/* Pattern */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Pattern Format</h4>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <code className="text-sm font-mono text-gray-900">{pattern.pattern}</code>
                      </div>
                    </div>

                    {/* Rules */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Rules</h4>
                      <ul className="space-y-2">
                        {pattern.rules.map((rule, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Examples</h4>
                      <div className="space-y-2">
                        {pattern.examples.map((example, index) => (
                          <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <code className="text-sm font-mono text-green-800">{example}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Field Details */}
                    {pattern.fields && pattern.fields.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Field Details</h4>
                        <div className="space-y-4">
                          {pattern.fields.map((field, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-700 mb-1">Field Name</h5>
                                  <p className="text-sm text-gray-900 font-medium">{field.name}</p>
                                </div>
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-700 mb-1">Convention</h5>
                                  <code className="text-xs font-mono text-indigo-600">{field.convention}</code>
                                </div>
                                <div className="md:col-span-2">
                                  <h5 className="text-xs font-semibold text-gray-700 mb-1">Guidelines</h5>
                                  <p className="text-xs text-gray-600">{field.guidelines}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <h5 className="text-xs font-semibold text-gray-700 mb-1">Example</h5>
                                  <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-300 inline-block">
                                    {field.example}
                                  </code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredPatterns.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patterns found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link
            href="/code-forge/naming-conventions/pattern-tester"
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-200 group"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              Test Your Patterns
            </h4>
            <p className="text-sm text-gray-600">
              Use the Pattern Tester to validate artifact names against these conventions
            </p>
          </Link>

          <Link
            href="/code-forge/review"
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-200 group"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              Code Review
            </h4>
            <p className="text-sm text-gray-600">
              Upload OIC integration files for comprehensive naming analysis
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

