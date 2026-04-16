'use client'

import { ExplorerState, NamingCategory, CategoryInfo } from '@/lib/naming-types'
import {
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface ExplorerPanelProps {
  state: ExplorerState
  onSelectCategory: (category: NamingCategory) => void
  onSelectConvention: (conventionId: string) => void
  onSearch: (query: string) => void
}

const categories: CategoryInfo[] = [
  {
    id: 'integrations',
    label: 'Integrations',
    icon: '🔗',
    description: 'Integration naming standards',
    conventionCount: 5,
    color: '#0ea5e9',
  },
  {
    id: 'connections',
    label: 'Connections',
    icon: '🔌',
    description: 'Connection naming standards',
    conventionCount: 6,
    color: '#10b981',
  },
  {
    id: 'lookups',
    label: 'Lookups',
    icon: '📋',
    description: 'Lookup naming standards',
    conventionCount: 5,
    color: '#f59e0b',
  },
  {
    id: 'packages',
    label: 'Packages',
    icon: '📦',
    description: 'Package naming standards',
    conventionCount: 4,
    color: '#8b5cf6',
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: '🤖',
    description: 'Agent naming standards',
    conventionCount: 4,
    color: '#06b6d4',
  },
  {
    id: 'libraries',
    label: 'Libraries',
    icon: '📚',
    description: 'Library naming standards',
    conventionCount: 5,
    color: '#84cc16',
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: '⚡',
    description: 'Action naming standards',
    conventionCount: 10,
    color: '#f97316',
  },
]

// Mock conventions data
const mockConventions: Record<NamingCategory, any[]> = {
  integrations: [
    { id: 'int-1', name: 'Integration Name', field: 'Name' },
    { id: 'int-2', name: 'Integration Identifier', field: 'Identifier' },
    { id: 'int-3', name: 'Integration Version', field: 'Version' },
    { id: 'int-4', name: 'Integration Description', field: 'Description' },
    { id: 'int-5', name: 'Integration Package', field: 'Package' },
    { id: 'int-6', name: 'Integration Project', field: 'Project' },
    { id: 'int-7', name: 'Integration Schedule', field: 'Schedule' },
    { id: 'int-8', name: 'Integration Error Handler', field: 'Error Handler' },
  ],
  connections: [
    { id: 'conn-1', name: 'Connection Name', field: 'Name' },
    { id: 'conn-2', name: 'Connection Identifier', field: 'Identifier' },
    { id: 'conn-3', name: 'Connection Type', field: 'Type' },
    { id: 'conn-4', name: 'Connection Description', field: 'Description' },
    { id: 'conn-5', name: 'Connection Role', field: 'Role' },
    { id: 'conn-6', name: 'Connection Security', field: 'Security Policy' },
  ],
  lookups: [
    { id: 'lookup-1', name: 'Lookup Name', field: 'Name' },
    { id: 'lookup-2', name: 'Lookup Identifier', field: 'Identifier' },
    { id: 'lookup-3', name: 'Lookup Description', field: 'Description' },
    { id: 'lookup-4', name: 'Lookup Type', field: 'Type' },
    { id: 'lookup-5', name: 'Lookup Values', field: 'Values' },
  ],
  packages: [
    { id: 'pkg-1', name: 'Package Name', field: 'Name' },
    { id: 'pkg-2', name: 'Package Identifier', field: 'Identifier' },
    { id: 'pkg-3', name: 'Package Version', field: 'Version' },
    { id: 'pkg-4', name: 'Package Description', field: 'Description' },
  ],
  projects: [
    { id: 'proj-1', name: 'Project Name', field: 'Name' },
    { id: 'proj-2', name: 'Project Identifier', field: 'Identifier' },
    { id: 'proj-3', name: 'Project Description', field: 'Description' },
  ],
  agents: [
    { id: 'agent-1', name: 'Agent Name', field: 'Name' },
    { id: 'agent-2', name: 'Agent Identifier', field: 'Identifier' },
    { id: 'agent-3', name: 'Agent Group', field: 'Group' },
    { id: 'agent-4', name: 'Agent Description', field: 'Description' },
  ],
  libraries: [
    { id: 'lib-1', name: 'Library Name', field: 'Name' },
    { id: 'lib-2', name: 'Library Identifier', field: 'Identifier' },
    { id: 'lib-3', name: 'Library Version', field: 'Version' },
    { id: 'lib-4', name: 'Library Type', field: 'Type' },
    { id: 'lib-5', name: 'Library Description', field: 'Description' },
  ],
  actions: [
    { id: 'action-1', name: 'Action Name', field: 'Name' },
    { id: 'action-2', name: 'Action Identifier', field: 'Identifier' },
    { id: 'action-3', name: 'Action Type', field: 'Type' },
    { id: 'action-4', name: 'Action Input', field: 'Input Parameters' },
    { id: 'action-5', name: 'Action Output', field: 'Output Parameters' },
    { id: 'action-6', name: 'Action Error', field: 'Error Handling' },
    { id: 'action-7', name: 'Action Timeout', field: 'Timeout' },
    { id: 'action-8', name: 'Action Retry', field: 'Retry Policy' },
    { id: 'action-9', name: 'Action Description', field: 'Description' },
    { id: 'action-10', name: 'Action Tags', field: 'Tags' },
  ],
}

export default function ExplorerPanel({
  state,
  onSelectCategory,
  onSelectConvention,
  onSearch,
}: ExplorerPanelProps) {
  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(state.searchQuery.toLowerCase())
  )

  return (
    <div className="w-60 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Explorer</h2>
        
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={state.searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Category Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredCategories.map((category) => {
            const isSelected = state.selectedCategory === category.id

            return (
              <div key={category.id}>
                {/* Category Item */}
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    ${isSelected
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="flex-1 text-left">{category.label}</span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    {category.conventionCount}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer - Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 
                   bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium
                   rounded-lg shadow-sm transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Convention</span>
        </button>
      </div>
    </div>
  )
}

