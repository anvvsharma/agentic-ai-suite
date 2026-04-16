'use client'

import { motion } from 'framer-motion'
import { InspectorState } from '@/lib/naming-types'

interface InspectorPanelProps {
  state: InspectorState
  selectedConvention: string | null
  onSectionChange: (section: 'properties' | 'validation' | 'usage' | 'related') => void
}

export default function InspectorPanel({
  state,
  selectedConvention,
  onSectionChange,
}: InspectorPanelProps) {
  // Mock data
  const mockData = {
    properties: {
      status: 'Active',
      category: 'Integrations',
      component: 'Integration',
      field: 'Name',
      createdBy: 'John Doe',
      createdAt: '2024-01-15',
      updatedAt: '2024-03-20',
      tags: ['OIC', 'Enterprise', 'Standard'],
    },
    validation: {
      rules: [
        { name: 'Pattern Match', status: 'enabled', severity: 'error' },
        { name: 'Length Check', status: 'enabled', severity: 'error' },
        { name: 'Case Sensitivity', status: 'enabled', severity: 'warning' },
        { name: 'Reserved Words', status: 'enabled', severity: 'error' },
      ],
      constraints: {
        minLength: 10,
        maxLength: 50,
        caseSensitive: true,
        allowSpaces: false,
      },
    },
    usage: {
      totalUsage: 1247,
      thisMonth: 89,
      successRate: 94.5,
      topUsers: ['Team A', 'Team B', 'Team C'],
      recentActivity: [
        { user: 'Alice', action: 'validated', time: '2 hours ago' },
        { user: 'Charlie', action: 'used', time: '5 hours ago' },
        { user: 'Charlie', action: 'validated', time: '1 day ago' },
      ],
    },
    related: [
      { id: '1', name: 'Integration Identifier', type: 'convention' },
      { id: '2', name: 'Integration Version', type: 'convention' },
      { id: '3', name: 'Connection Name', type: 'convention' },
    ],
  }

  if (!selectedConvention) {
    return (
      <div className="w-72 h-full flex items-center justify-center bg-gray-50 border-l border-gray-200">
        <div className="text-center px-4">
          <div className="text-4xl mb-2">👁️</div>
          <p className="text-sm text-gray-500">
            Select a convention to view details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Inspector</h2>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          {[
            { id: 'properties', label: 'Properties', icon: '⚙️' },
            { id: 'validation', label: 'Validation', icon: '✓' },
            { id: 'usage', label: 'Usage', icon: '📊' },
            { id: 'related', label: 'Related', icon: '🔗' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id as any)}
              className={`
                flex-1 py-2 text-xs font-medium
                border-b-2 transition-all duration-200
                ${state.activeSection === section.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
              title={section.label}
            >
              <span className="text-base">{section.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={state.activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Properties Section */}
          {state.activeSection === 'properties' && (
            <div className="space-y-4">
              <PropertyCard title="Status">
                <StatusBadge status={mockData.properties.status} />
              </PropertyCard>

              <PropertyCard title="Category">
                <span className="text-sm text-gray-900">{mockData.properties.category}</span>
              </PropertyCard>

              <PropertyCard title="Component">
                <span className="text-sm text-gray-900">{mockData.properties.component}</span>
              </PropertyCard>

              <PropertyCard title="Field">
                <span className="text-sm text-gray-900">{mockData.properties.field}</span>
              </PropertyCard>

              <PropertyCard title="Created By">
                <span className="text-sm text-gray-900">{mockData.properties.createdBy}</span>
              </PropertyCard>

              <PropertyCard title="Created">
                <span className="text-sm text-gray-600">{mockData.properties.createdAt}</span>
              </PropertyCard>

              <PropertyCard title="Updated">
                <span className="text-sm text-gray-600">{mockData.properties.updatedAt}</span>
              </PropertyCard>

              <PropertyCard title="Tags">
                <div className="flex flex-wrap gap-1">
                  {mockData.properties.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </PropertyCard>
            </div>
          )}

          {/* Validation Section */}
          {state.activeSection === 'validation' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-3">
                  Validation Rules
                </h3>
                <div className="space-y-2">
                  {mockData.validation.rules.map((rule) => (
                    <div
                      key={rule.name}
                      className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                    >
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{rule.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{rule.severity}</div>
                      </div>
                      <div className={`
                        w-2 h-2 rounded-full
                        ${rule.status === 'enabled' ? 'bg-green-500' : 'bg-gray-300'}
                      `} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-3">
                  Constraints
                </h3>
                <div className="space-y-2">
                  <PropertyCard title="Min Length">
                    <span className="text-sm text-gray-900">{mockData.validation.constraints.minLength}</span>
                  </PropertyCard>
                  <PropertyCard title="Max Length">
                    <span className="text-sm text-gray-900">{mockData.validation.constraints.maxLength}</span>
                  </PropertyCard>
                  <PropertyCard title="Case Sensitive">
                    <span className="text-sm text-gray-900">
                      {mockData.validation.constraints.caseSensitive ? 'Yes' : 'No'}
                    </span>
                  </PropertyCard>
                  <PropertyCard title="Allow Spaces">
                    <span className="text-sm text-gray-900">
                      {mockData.validation.constraints.allowSpaces ? 'Yes' : 'No'}
                    </span>
                  </PropertyCard>
                </div>
              </div>
            </div>
          )}

          {/* Usage Section */}
          {state.activeSection === 'usage' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {mockData.usage.totalUsage.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Usage</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {mockData.usage.thisMonth}
                  </div>
                  <div className="text-xs text-gray-500">This Month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-xl font-bold text-green-600 mb-1">
                    {mockData.usage.successRate}%
                  </div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-3">
                  Top Users
                </h3>
                <div className="space-y-2">
                  {mockData.usage.topUsers.map((user, index) => (
                    <div
                      key={user}
                      className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded"
                    >
                      <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-900">{user}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {mockData.usage.recentActivity.map((activity, index) => (
                    <div key={index} className="p-2 bg-white border border-gray-200 rounded">
                      <div className="text-sm text-gray-900">{activity.user}</div>
                      <div className="text-xs text-gray-500">
                        {activity.action} • {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Section */}
          {state.activeSection === 'related' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-700 uppercase mb-3">
                Related Conventions
              </h3>
              {mockData.related.map((item) => (
                <button
                  key={item.id}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg
                           hover:border-primary-300 hover:bg-primary-50
                           transition-all duration-200 text-left"
                >
                  <div className="text-sm text-gray-900 mb-1">{item.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
          Edit Convention
        </button>
        <button className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
          Duplicate
        </button>
        <button className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}

// Helper Components
function PropertyCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    Draft: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Archived: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <span className={`
      inline-flex items-center px-2 py-1 text-xs font-medium rounded border
      ${colors[status as keyof typeof colors] || colors.Active}
    `}>
      {status}
    </span>
  )
}

