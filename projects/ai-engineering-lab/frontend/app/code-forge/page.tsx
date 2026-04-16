'use client'

import Link from 'next/link'
import {
  Zap, FileText, Shield, BookOpen, Settings, ArrowRight,
  CheckCircle2, Activity, TrendingUp, Code2, AlertCircle, ArrowLeft
} from 'lucide-react'

export default function CodeForgeDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/dashboard" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <Zap className="w-8 h-8" />
            <h1 className="text-3xl font-bold">CodeForge</h1>
          </div>
          <p className="text-indigo-100">
            Comprehensive code analysis with configurable standards, naming conventions, and enterprise-grade rules
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">412</h3>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">1,247</h3>
            <p className="text-sm text-gray-600">Issues Found</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                2.1s avg
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">98.5%</h3>
            <p className="text-sm text-gray-600">Accuracy Rate</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">CodeForge Tools & Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Code Review Card */}
            <Link href="/code-forge/review" className="group">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Code Review</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI-powered code analysis with real-time feedback
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    412 uses
                  </span>
                  <span className="text-gray-500">2.1s avg</span>
                </div>
                <div className="mt-4 text-indigo-600 font-semibold text-sm inline-flex items-center gap-1">
                  Start Review <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Rules Register Card */}
            <Link href="/code-forge/rules-register" className="group">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rules Register</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage and configure coding rules
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    156 rules
                  </span>
                  <span className="text-gray-500">Active</span>
                </div>
                <div className="mt-4 text-indigo-600 font-semibold text-sm inline-flex items-center gap-1">
                  View Rules <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Naming Conventions Card */}
            <Link href="/code-forge/naming-conventions" className="group">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Naming Conventions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enterprise naming standards and validation
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    156 patterns
                  </span>
                  <span className="text-gray-500">OIC Ready</span>
                </div>
                <div className="mt-4 text-purple-600 font-semibold text-sm inline-flex items-center gap-1">
                  View Standards <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Rule Sets Card */}
            <Link href="/code-forge/rule-sets" className="group">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rule Sets</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage custom rule configurations
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    <Activity className="w-3 h-3 inline mr-1" />
                    45 rules
                  </span>
                  <span className="text-gray-500">Customizable</span>
                </div>
                <div className="mt-4 text-blue-600 font-semibold text-sm inline-flex items-center gap-1">
                  Manage Rules <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Review Your Code?</h3>
              <p className="text-gray-600">
                Upload your code or paste it directly to get instant feedback with enterprise-grade standards
              </p>
            </div>
            <Link
              href="/code-forge/review"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 whitespace-nowrap"
            >
              Start Code Review
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Multi-Language Support</h4>
            <p className="text-sm text-gray-600">
              Python, JavaScript, Java, OIC, and more with technology-specific rules
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Enterprise Standards</h4>
            <p className="text-sm text-gray-600">
              Pre-configured rulesets for enterprise-grade code quality
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Detailed Reports</h4>
            <p className="text-sm text-gray-600">
              Comprehensive analysis with actionable insights and suggestions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

