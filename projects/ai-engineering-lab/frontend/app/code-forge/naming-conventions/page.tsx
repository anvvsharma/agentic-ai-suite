'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileCode, ArrowLeft, Sparkles } from 'lucide-react'

export default function NamingConventionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/code-forge" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <FileCode className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Naming Conventions</h1>
          </div>
          <p className="text-indigo-100">
            Configure naming patterns and conventions for your codebase
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pattern Tester - Active */}
            <Link
              href="/code-forge/naming-conventions/pattern-tester"
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-6 border-2 border-indigo-200 hover:border-indigo-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Pattern Tester
                  </h3>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Test and validate artifact names against OIC naming conventions in real-time
              </p>
              <div className="flex items-center text-xs text-indigo-600 font-medium">
                Try it now →
              </div>
            </Link>

            {/* Pattern Guide - Active */}
            <Link
              href="/code-forge/naming-conventions/pattern-guide"
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-6 border-2 border-blue-200 hover:border-blue-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCode className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Pattern Guide
                  </h3>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive reference guide for all OIC naming patterns and conventions
              </p>
              <div className="flex items-center text-xs text-blue-600 font-medium">
                View guide →
              </div>
            </Link>

            {/* Bulk Validator - Active */}
            <Link
              href="/code-forge/naming-conventions/bulk-validator"
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-6 border-2 border-green-200 hover:border-green-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCode className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Bulk Validator
                  </h3>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Validate multiple artifact names at once and export compliance reports
              </p>
              <div className="flex items-center text-xs text-green-600 font-medium">
                Start validating →
              </div>
            </Link>

            {/* Name Generator - Active */}
            <Link
              href="/code-forge/naming-conventions/name-generator"
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-6 border-2 border-purple-200 hover:border-purple-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Name Generator
                  </h3>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Smart name generator that creates compliant artifact names from your inputs
              </p>
              <div className="flex items-center text-xs text-purple-600 font-medium">
                Generate names →
              </div>
            </Link>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  OIC Naming Conventions
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Our naming convention tools help ensure your Oracle Integration Cloud artifacts follow enterprise standards. 
                  Start with the Pattern Tester to validate individual names, or use Code Review for comprehensive analysis of integration files.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">Integrations</span>
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">Connections</span>
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">Lookups</span>
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">Packages</span>
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/code-forge/review"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-200 group"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Code Review with Naming Analysis
              </h4>
              <p className="text-sm text-gray-600">
                Upload OIC integration files (.iar) to get comprehensive naming convention analysis along with code review
              </p>
            </Link>

            <Link
              href="/code-forge/rules-register"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-200 group"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Rules Register
              </h4>
              <p className="text-sm text-gray-600">
                Manage and configure coding rules including naming convention rules
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

