'use client'

import Link from 'next/link'
import {
  BarChart3,
  TestTube2,
  Truck,
  Zap,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCode,
  GitBranch,
  Users,
  Sparkles
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back! Here's what's happening with your projects today.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Report
              </button>
              <Link
                href="/code-forge"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                New Review
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Active Projects */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCode className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
            <p className="text-sm text-gray-600">Active Projects</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">3 new</span> this week
              </p>
            </div>
          </div>

          {/* Code Reviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">156</h3>
            <p className="text-sm text-gray-600">Code Reviews</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-purple-600 font-medium">12 pending</span> review
              </p>
            </div>
          </div>

          {/* Issues Found */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                +23
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">89</h3>
            <p className="text-sm text-gray-600">Issues Found</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-red-600 font-medium">15 critical</span> priority
              </p>
            </div>
          </div>

          {/* Avg Response Time */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                -15%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">2.4s</h3>
            <p className="text-sm text-gray-600">Avg Response Time</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">Improved</span> from last week
              </p>
            </div>
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">AI-Powered Tools</h2>
            <Link href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TDD Generator */}
            <Link href="/tdd-generator" className="group">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-green-200 transition-all">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TestTube2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">TDD Generator</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate comprehensive test suites automatically
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    234 uses
                  </span>
                  <span className="text-gray-500">2.3s avg</span>
                </div>
              </div>
            </Link>

            {/* Integration Analyzer */}
            <Link href="/integration-analyzer" className="group">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Integration Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analyze integration dependencies and architecture
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    156 uses
                  </span>
                  <span className="text-gray-500">1.8s avg</span>
                </div>
              </div>
            </Link>

            {/* Smart Path Finder */}
            <Link href="/smart-path-finder" className="group">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Smart Path Finder</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Intelligent path planning with AI
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    89 uses
                  </span>
                  <span className="text-gray-500">3.1s avg</span>
                </div>
              </div>
            </Link>

            {/* CodeForge */}
            <Link href="/code-forge" className="group">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">CodeForge</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enterprise code review with configurable rules
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    412 uses
                  </span>
                  <span className="text-gray-500">2.1s avg</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Charts and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Issues by Severity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Issues by Severity</h3>
            <div className="space-y-4">
              {/* Critical */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Critical</span>
                  <span className="text-sm font-bold text-red-600">15</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              {/* High */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">High</span>
                  <span className="text-sm font-bold text-orange-600">28</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
              
              {/* Medium */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Medium</span>
                  <span className="text-sm font-bold text-yellow-600">31</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              {/* Low */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Low</span>
                  <span className="text-sm font-bold text-blue-600">15</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Technology Distribution</h3>
            <div className="space-y-4">
              {/* Python */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Python</span>
                  <span className="text-sm font-bold text-blue-600">42%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              {/* JavaScript/TypeScript */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">JavaScript/TS</span>
                  <span className="text-sm font-bold text-yellow-600">35%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              {/* Java */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Java</span>
                  <span className="text-sm font-bold text-red-600">15%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              {/* Others */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Others</span>
                  <span className="text-sm font-bold text-gray-600">8%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {/* Activity Item 1 */}
            <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Code review completed for <span className="text-primary-600">payment-service</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Found 3 issues • 2 suggestions • 1 best practice
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">2 min ago</span>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <TestTube2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    TDD Generator created test suite for <span className="text-primary-600">user-auth</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Generated 24 test cases • 95% coverage
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">15 min ago</span>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Integration Analyzer detected circular dependency
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    service-a → service-b → service-c → service-a
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">1 hour ago</span>
              </div>
            </div>

            {/* Activity Item 4 */}
            <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Smart path finding completed for <span className="text-primary-600">delivery-batch-42</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Optimized 15 stops • Saved 23% travel time
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">2 hours ago</span>
              </div>
            </div>

            {/* Activity Item 5 */}
            <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    New ruleset applied: <span className="text-primary-600">OIC Enterprise Standards</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    45 rules active • Strict mode enabled
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">3 hours ago</span>
              </div>
            </div>
          </div>
          
          {/* View All Link */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
              View all activity
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

