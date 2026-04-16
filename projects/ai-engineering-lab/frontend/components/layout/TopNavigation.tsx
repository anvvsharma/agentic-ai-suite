'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Settings, Moon, Sun, ChevronDown, Home } from 'lucide-react'

export default function TopNavigation() {
  const [isDark, setIsDark] = useState(false)
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Home className="w-6 h-6 text-primary-600" />
          <h1 className="text-lg font-bold text-gray-900">
            AI Engineering Lab
          </h1>
        </Link>

        {/* Center: Workspace Selector */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gray-50 hover:bg-gray-100 transition-colors
                text-sm font-medium text-gray-700 w-full
              "
              title="Switch between different project workspaces"
            >
              <span className="flex-1 text-left truncate">Current Workspace</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </button>

            {/* Workspace Dropdown */}
            {showWorkspaceMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {/* Info Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-xs font-medium text-gray-900">Workspaces</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Organize your projects, code reviews, and configurations
                  </p>
                </div>
                
                {/* Workspace List */}
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="flex-1">Current Workspace</span>
                    <span className="text-xs text-gray-500">Active</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    <span className="flex-1">Project Alpha</span>
                    <span className="text-xs text-gray-500">3 files</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    <span className="flex-1">Project Beta</span>
                    <span className="text-xs text-gray-500">7 files</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-200" />
                
                {/* Create New */}
                <button className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors font-medium">
                  + Create New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Search (Cmd+K)"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Settings Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="
                flex items-center gap-2 px-3 py-2 rounded-lg
                hover:bg-gray-100 transition-colors
              "
            >
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Preferences
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Billing
                </button>
                <div className="border-t border-gray-200 my-2" />
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

