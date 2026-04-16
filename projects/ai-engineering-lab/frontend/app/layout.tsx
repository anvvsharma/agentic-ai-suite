'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import './globals.css'
import TopNavigation from '@/components/layout/TopNavigation'
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar'
import ContextPanel from '@/components/layout/ContextPanel'
import FloatingAIAssistant from '@/components/layout/FloatingAIAssistant'
import { PanelRightOpen } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false)

  return (
    <html lang="en">
      <head>
        <title>AI Engineering Lab</title>
        <meta name="description" content="Multi-tool AI-powered engineering platform" />
      </head>
      <body className={inter.className}>
        {/* Top Navigation */}
        <TopNavigation />

        {/* Main Layout */}
        <div className="flex pt-14">
          {/* Collapsible Sidebar */}
          <CollapsibleSidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-h-[calc(100vh-3.5rem)] bg-gray-50">
            {/* Context Panel Toggle Button */}
            <button
              onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
              className="
                fixed top-20 right-4 z-30 p-2 rounded-lg
                bg-white border border-gray-200 shadow-sm
                hover:bg-gray-50 transition-colors
              "
              title="Toggle Context Panel"
            >
              <PanelRightOpen className="w-5 h-5 text-gray-600" />
            </button>

            {/* Page Content */}
            <div className="h-full">
              {children}
            </div>
          </main>

          {/* Context Panel */}
          <ContextPanel
            isOpen={isContextPanelOpen}
            onClose={() => setIsContextPanelOpen(false)}
          />
        </div>

        {/* Floating AI Assistant */}
        <FloatingAIAssistant />
      </body>
    </html>
  )
}

