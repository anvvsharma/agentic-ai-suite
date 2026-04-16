'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Pin, PinOff, FileText, Database, Sparkles, ChevronRight } from 'lucide-react'

interface ContextPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContextPanel({ isOpen, onClose }: ContextPanelProps) {
  const pathname = usePathname()
  const [isPinned, setIsPinned] = useState(false)
  const [activeTab, setActiveTab] = useState<'files' | 'data' | 'ai'>('files')

  // Get contextual files based on current page
  const getContextualFiles = () => {
    if (pathname?.includes('code-forge') || pathname?.includes('standards-rules')) {
      return [
        { name: 'UserService.py', size: '3.2 KB', time: '2 min ago' },
        { name: 'integration.iar', size: '24.5 KB', time: '5 min ago' },
        { name: 'standards.json', size: '1.8 KB', time: '1 hour ago' }
      ]
    } else if (pathname?.includes('smart-path-finder')) {
      return [
        { name: 'deliveries.csv', size: '2.4 KB', time: '2 min ago' },
        { name: 'routes.json', size: '15.8 KB', time: '5 min ago' },
        { name: 'config.yaml', size: '1.2 KB', time: '1 hour ago' }
      ]
    } else if (pathname?.includes('tdd-generator')) {
      return [
        { name: 'test_suite.py', size: '5.1 KB', time: '2 min ago' },
        { name: 'coverage.xml', size: '8.3 KB', time: '5 min ago' },
        { name: 'test_config.json', size: '0.9 KB', time: '1 hour ago' }
      ]
    } else if (pathname?.includes('integration-analyzer')) {
      return [
        { name: 'api_spec.yaml', size: '4.7 KB', time: '2 min ago' },
        { name: 'endpoints.json', size: '12.1 KB', time: '5 min ago' },
        { name: 'schema.graphql', size: '2.3 KB', time: '1 hour ago' }
      ]
    }
    return [
      { name: 'project.json', size: '2.4 KB', time: '2 min ago' },
      { name: 'config.yaml', size: '1.2 KB', time: '5 min ago' },
      { name: 'README.md', size: '3.5 KB', time: '1 hour ago' }
    ]
  }

  // Get contextual data based on current page
  const getContextualData = () => {
    if (pathname?.includes('code-forge') || pathname?.includes('standards-rules')) {
      return {
        active: [
          { title: 'Code Files', subtitle: '12 files analyzed', color: 'blue' },
          { title: 'Issues Found', subtitle: '8 violations detected', color: 'red' }
        ],
        variables: [
          { key: 'total_lines', value: '1,247' },
          { key: 'complexity', value: '23' },
          { key: 'coverage', value: '87%' }
        ]
      }
    } else if (pathname?.includes('smart-path-finder')) {
      return {
        active: [
          { title: 'Delivery Stops', subtitle: '45 locations loaded', color: 'blue' },
          { title: 'Smart Paths', subtitle: '3 vehicles, 20.4 km', color: 'green' }
        ],
        variables: [
          { key: 'num_vehicles', value: '3' },
          { key: 'capacity', value: '50' },
          { key: 'max_hours', value: '8.0' }
        ]
      }
    }
    return {
      active: [
        { title: 'Active Project', subtitle: 'AI Engineering Lab', color: 'blue' },
        { title: 'Status', subtitle: 'Ready', color: 'green' }
      ],
      variables: [
        { key: 'version', value: '1.0.0' },
        { key: 'env', value: 'dev' },
        { key: 'debug', value: 'true' }
      ]
    }
  }

  // Get contextual AI insights
  const getContextualInsights = () => {
    if (pathname?.includes('code-forge') || pathname?.includes('standards-rules')) {
      return [
        {
          title: 'Code Quality Tip',
          message: 'Consider adding more error handling to improve robustness.',
          color: 'purple'
        },
        {
          title: 'Standards Alert',
          message: '3 naming convention violations detected in recent files.',
          color: 'amber'
        }
      ]
    } else if (pathname?.includes('smart-path-finder')) {
      return [
        {
          title: 'Path Finding Tip',
          message: 'Consider increasing vehicle capacity to reduce the number of routes needed.',
          color: 'purple'
        },
        {
          title: 'Time Window Alert',
          message: '3 stops have tight time windows. Consider adjusting constraints.',
          color: 'amber'
        }
      ]
    }
    return [
      {
        title: 'Platform Tip',
        message: 'Explore all tools to maximize your productivity.',
        color: 'purple'
      }
    ]
  }

  if (!isOpen && !isPinned) return null

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && !isPinned && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={`
          fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 bg-white border-l border-gray-200
          transition-transform duration-300 ease-in-out z-50
          ${isOpen || isPinned ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Context</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title={isPinned ? 'Unpin' : 'Pin'}
            >
              {isPinned ? (
                <PinOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Pin className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('files')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              transition-colors border-b-2
              ${activeTab === 'files'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            Files
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              transition-colors border-b-2
              ${activeTab === 'data'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Database className="w-4 h-4" />
            Data
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              transition-colors border-b-2
              ${activeTab === 'ai'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Sparkles className="w-4 h-4" />
            AI
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'files' && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Recent Files
              </p>
              {getContextualFiles().map((file, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size} • {file.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Active Data
                </p>
                <div className="space-y-2">
                  {getContextualData().active.map((item, idx) => (
                    <div key={idx} className={`p-3 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
                      <p className={`text-sm font-medium text-${item.color}-900`}>{item.title}</p>
                      <p className={`text-xs text-${item.color}-700 mt-1`}>{item.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Variables
                </p>
                <div className="space-y-2 text-xs font-mono">
                  {getContextualData().variables.map((variable, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">{variable.key}</span>
                      <span className="text-gray-900 font-medium">{variable.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  AI Insights
                </p>
                <div className="space-y-3">
                  {getContextualInsights().map((insight, idx) => (
                    <div key={idx} className={`p-3 bg-${insight.color}-50 rounded-lg border border-${insight.color}-200`}>
                      <div className="flex items-start gap-2">
                        <Sparkles className={`w-4 h-4 text-${insight.color}-600 flex-shrink-0 mt-0.5`} />
                        <div>
                          <p className={`text-sm font-medium text-${insight.color}-900`}>{insight.title}</p>
                          <p className={`text-xs text-${insight.color}-700 mt-1`}>
                            {insight.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Suggestions
                </p>
                <div className="space-y-2">
                  {pathname?.includes('code-forge') || pathname?.includes('standards-rules') ? (
                    <>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        <p className="text-sm text-gray-900">Analyze code quality</p>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        <p className="text-sm text-gray-900">Check standards compliance</p>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        <p className="text-sm text-gray-900">Export review report</p>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        <p className="text-sm text-gray-900">Analyze current data</p>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        <p className="text-sm text-gray-900">Generate insights</p>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        <p className="text-sm text-gray-900">Export report</p>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

