'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CanvasState, NamingCategory } from '@/lib/naming-types'

interface CanvasPanelProps {
  state: CanvasState
  selectedConvention: string | null
  selectedCategory: NamingCategory | null
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onContentChange: () => void
}

// Mock conventions grouped by category
const categoryConventions: Record<NamingCategory, any[]> = {
  integrations: [
    {
      id: 'int-1',
      field: 'Name',
      pattern: '<ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>',
      description: 'Standard naming convention for integration names',
      guidelines: 'Use uppercase, underscore separators, max 50 chars',
      examples: [
        { value: 'BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT', isCorrect: true, note: 'Correct format' },
        { value: '3PL_ERP_TRANSACTIONS', isCorrect: false, note: 'Missing ORG component' },
      ],
    },
    {
      id: 'int-2',
      field: 'Identifier',
      pattern: '<ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>',
      description: 'Unique identifier for integration',
      guidelines: 'Same as name but used for technical reference',
      examples: [
        { value: 'BCRX_ERP_WMS_ORDERSYNC_RT', isCorrect: true, note: 'Valid identifier' },
      ],
    },
    {
      id: 'int-3',
      field: 'Version',
      pattern: '<MAJOR>.<MINOR>.<PATCH>',
      description: 'Semantic versioning for integrations',
      guidelines: 'Follow semantic versioning: MAJOR.MINOR.PATCH',
      examples: [
        { value: '1.0.0', isCorrect: true, note: 'Initial release' },
        { value: '2.1.5', isCorrect: true, note: 'Bug fix release' },
      ],
    },
    {
      id: 'int-4',
      field: 'Description',
      pattern: 'Free text (max 255 chars)',
      description: 'Human-readable description',
      guidelines: 'Clear, concise description of integration purpose',
      examples: [
        { value: 'Import transactions from 3PL to ERP system', isCorrect: true, note: 'Clear and descriptive' },
      ],
    },
    {
      id: 'int-5',
      field: 'Package',
      pattern: '<ORG>_<DOMAIN>_<SUBDOMAIN>',
      description: 'Package grouping for integrations',
      guidelines: 'Group related integrations by business domain',
      examples: [
        { value: 'BCRX_SUPPLY_CHAIN_LOGISTICS', isCorrect: true, note: 'Valid package name' },
      ],
    },
  ],
  connections: [
    {
      id: 'conn-1',
      field: 'Name',
      pattern: '<ORG>_<SYSTEM>_<TYPE>_CONN',
      description: 'Connection name pattern',
      guidelines: 'Identify system and connection type',
      examples: [
        { value: 'BCRX_SALESFORCE_REST_CONN', isCorrect: true, note: 'Valid connection name' },
      ],
    },
    {
      id: 'conn-2',
      field: 'Identifier',
      pattern: '<ORG>_<SYSTEM>_<TYPE>_CONN',
      description: 'Unique connection identifier',
      guidelines: 'Same as name for consistency',
      examples: [
        { value: 'BCRX_SAP_SOAP_CONN', isCorrect: true, note: 'Valid identifier' },
      ],
    },
    {
      id: 'conn-3',
      field: 'Type',
      pattern: 'REST | SOAP | FTP | DB | FILE',
      description: 'Connection type',
      guidelines: 'Use standard connection types',
      examples: [
        { value: 'REST', isCorrect: true, note: 'REST API connection' },
        { value: 'SOAP', isCorrect: true, note: 'SOAP web service' },
      ],
    },
    {
      id: 'conn-4',
      field: 'Description',
      pattern: 'Free text (max 255 chars)',
      description: 'Connection description',
      guidelines: 'Describe the target system and purpose',
      examples: [
        { value: 'Salesforce CRM REST API connection', isCorrect: true, note: 'Clear description' },
      ],
    },
    {
      id: 'conn-5',
      field: 'Role',
      pattern: 'SOURCE | TARGET | BIDIRECTIONAL',
      description: 'Connection role in integration',
      guidelines: 'Define data flow direction',
      examples: [
        { value: 'SOURCE', isCorrect: true, note: 'Data source' },
        { value: 'TARGET', isCorrect: true, note: 'Data destination' },
      ],
    },
    {
      id: 'conn-6',
      field: 'Security Policy',
      pattern: '<ORG>_<SYSTEM>_SECURITY_POLICY',
      description: 'Security policy name',
      guidelines: 'Reference security configuration',
      examples: [
        { value: 'BCRX_SALESFORCE_SECURITY_POLICY', isCorrect: true, note: 'Valid policy name' },
      ],
    },
  ],
  lookups: [],
  packages: [],
  projects: [],
  agents: [],
  libraries: [],
  actions: [],
}

export default function CanvasPanel({
  state,
  selectedConvention,
  selectedCategory,
  onTabChange,
  onTabClose,
  onContentChange,
}: CanvasPanelProps) {
  const [expandedConventions, setExpandedConventions] = useState<string[]>([])

  // Get conventions for selected category
  const conventions = selectedCategory ? categoryConventions[selectedCategory] || [] : []

  const toggleConvention = (id: string) => {
    if (expandedConventions.includes(id)) {
      setExpandedConventions(expandedConventions.filter(c => c !== id))
    } else {
      setExpandedConventions([...expandedConventions, id])
    }
  }

  if (!selectedCategory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Category Selected</h3>
          <p className="text-sm text-gray-500">
            Select a category from the explorer to view naming conventions
          </p>
        </div>
      </div>
    )
  }

  const categoryLabels: Record<NamingCategory, string> = {
    integrations: 'Integrations',
    connections: 'Connections',
    lookups: 'Lookups',
    packages: 'Packages',
    projects: 'Projects',
    agents: 'Agents',
    libraries: 'Libraries',
    actions: 'Actions',
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {categoryLabels[selectedCategory]} Naming Conventions
        </h1>
        <p className="text-sm text-gray-600">
          {conventions.length} naming conventions defined for this category
        </p>
      </div>

      {/* Content Area - All Conventions */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl space-y-6">
          {conventions.map((convention) => {
            const isExpanded = expandedConventions.includes(convention.id)
            
            return (
              <motion.div
                key={convention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Convention Header */}
                <button
                  onClick={() => toggleConvention(convention.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center text-lg
                      ${isExpanded ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}
                    `}>
                      📝
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {convention.field}
                      </h3>
                      <p className="text-sm text-gray-500">{convention.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">
                      {convention.pattern}
                    </code>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Convention Details (Expanded) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-6 space-y-6">
                        {/* Pattern */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Pattern</h4>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <code className="text-base font-mono text-primary-600">
                              {convention.pattern}
                            </code>
                          </div>
                        </div>

                        {/* Guidelines */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Guidelines</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">{convention.guidelines}</p>
                          </div>
                        </div>

                        {/* Examples */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Examples</h4>
                          <div className="space-y-3">
                            {convention.examples.map((example: any, idx: number) => (
                              <div
                                key={idx}
                                className={`
                                  border rounded-lg p-4
                                  ${example.isCorrect
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                  }
                                `}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`
                                    text-xl
                                    ${example.isCorrect ? 'text-green-600' : 'text-red-600'}
                                  `}>
                                    {example.isCorrect ? '✓' : '✗'}
                                  </div>
                                  <div className="flex-1">
                                    <code className={`
                                      block px-3 py-2 rounded text-sm font-mono mb-2
                                      ${example.isCorrect
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                      }
                                    `}>
                                      {example.value}
                                    </code>
                                    <p className={`
                                      text-xs
                                      ${example.isCorrect ? 'text-green-700' : 'text-red-700'}
                                    `}>
                                      {example.note}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                            Edit Convention
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                            Test Pattern
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Empty State */}
          {conventions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Conventions Yet
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Start by creating naming conventions for this category
              </p>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                + Create Convention
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

