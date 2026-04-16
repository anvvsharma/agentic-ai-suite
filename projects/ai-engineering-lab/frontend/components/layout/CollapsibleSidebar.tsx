'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  TestTube2,
  Truck,
  Zap,
  Shield,
  Plus,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  FileText,
  Settings
} from 'lucide-react'

interface SubNavItem {
  id: string
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavItem {
  id: string
  name: string
  shortName: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
  subItems?: SubNavItem[]
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    shortName: 'Home',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-indigo-600'
  },
  {
    id: 'integration-analyzer',
    name: 'Integration Analyzer',
    shortName: 'Int.',
    icon: BarChart3,
    href: '/integration-analyzer',
    color: 'text-blue-600'
  },
  {
    id: 'tdd-generator',
    name: 'TDD Generator',
    shortName: 'TDD',
    icon: TestTube2,
    href: '/tdd-generator',
    color: 'text-green-600'
  },
  {
    id: 'smart-path-finder',
    name: 'Smart Path Finder',
    shortName: 'Paths',
    icon: Truck,
    href: '/smart-path-finder',
    color: 'text-purple-600'
  },
  {
    id: 'code-forge',
    name: 'CodeForge',
    shortName: 'Forge',
    icon: Zap,
    href: '/code-forge',
    color: 'text-amber-600'
  }
]

export default function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['code-forge'])
  const pathname = usePathname()

  const toggleSubMenu = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out z-40
          ${isExpanded ? 'w-60' : 'w-12'}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Navigation Items */}
        <nav className="flex flex-col h-full py-4">
          <div className="flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.startsWith(item.href)
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isSubMenuExpanded = expandedItems.includes(item.id)
              const isAnySubItemActive = item.subItems?.some(sub => pathname?.startsWith(sub.href))
              
              return (
                <div key={item.id}>
                  {/* Main Item */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-2 py-2.5 rounded-lg flex-1
                        transition-all duration-200
                        ${isActive || isAnySubItemActive
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      title={!isExpanded ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive || isAnySubItemActive ? item.color : ''}`} />
                      <span
                        className={`
                          whitespace-nowrap overflow-hidden transition-all duration-300
                          ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                        `}
                      >
                        {item.name}
                      </span>
                    </Link>
                    
                    {/* Expand/Collapse Button for items with subitems */}
                    {hasSubItems && isExpanded && (
                      <button
                        onClick={() => toggleSubMenu(item.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            isSubMenuExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Sub Items */}
                  {hasSubItems && isExpanded && isSubMenuExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems!.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isSubActive = pathname?.startsWith(subItem.href)
                        
                        return (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            className={`
                              flex items-center gap-3 px-2 py-2 rounded-lg
                              transition-all duration-200
                              ${isSubActive
                                ? 'bg-indigo-50 text-indigo-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                              }
                            `}
                          >
                            <SubIcon className={`w-4 h-4 flex-shrink-0 ${isSubActive ? 'text-indigo-600' : ''}`} />
                            <span className="text-sm whitespace-nowrap">
                              {subItem.name}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />

          {/* Add Tool Button */}
          <div className="px-2">
            <button
              className="
                flex items-center gap-3 px-2 py-2.5 rounded-lg w-full
                text-gray-700 hover:bg-gray-100 transition-colors
              "
              title={!isExpanded ? 'Add Tool' : undefined}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              <span
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                `}
              >
                Add Tool
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />

          {/* AI Assistant Button */}
          <div className="px-2">
            <button
              className="
                flex items-center gap-3 px-2 py-2.5 rounded-lg w-full
                text-purple-600 hover:bg-purple-50 transition-colors
              "
              title={!isExpanded ? 'AI Assistant' : undefined}
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <span
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                `}
              >
                AI Assistant
              </span>
            </button>
          </div>

          {/* Expand/Collapse Toggle (bottom) */}
          <div className="px-2 pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="
                flex items-center justify-center w-full py-2 rounded-lg
                text-gray-500 hover:bg-gray-100 transition-colors
              "
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </nav>
      </aside>

      {/* Spacer to prevent content from going under sidebar */}
      <div className={`transition-all duration-300 ${isExpanded ? 'w-60' : 'w-12'}`} />
    </>
  )
}

