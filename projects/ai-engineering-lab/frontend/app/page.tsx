import Link from 'next/link'
import { Truck, BarChart3, TestTube2, Zap, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI Engineering Lab
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Multi-tool AI-powered platform for modern software engineering
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              API Docs
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Intelligent Engineering Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tool 1: Integration Analyzer */}
          <Link href="/integration-analyzer" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Integration Analyzer</h3>
              <p className="text-sm text-gray-600 mb-3">
                Analyze and optimize system integrations
              </p>
              <div className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1">
                Explore <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Tool 2: TDD Generator */}
          <Link href="/tdd-generator" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TestTube2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">TDD Generator</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate comprehensive test suites automatically
              </p>
              <div className="text-green-600 font-semibold text-sm inline-flex items-center gap-1">
                Explore <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Tool 3: Smart Path Finder */}
          <Link href="/smart-path-finder" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Path Finder</h3>
              <p className="text-sm text-gray-600 mb-3">
                Intelligent route planning with VRPTW
              </p>
              <div className="text-purple-600 font-semibold text-sm inline-flex items-center gap-1">
                Try Now <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Tool 4: CodeForge */}
          <Link href="/code-forge" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-amber-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">CodeForge</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enterprise code review with configurable rules
              </p>
              <div className="text-amber-600 font-semibold text-sm inline-flex items-center gap-1">
                Explore <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built with Modern Technologies
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Python + FastAPI</li>
                <li>✅ Google OR-Tools (VRPTW Solver)</li>
                <li>✅ SQLite Database</li>
                <li>✅ OpenAI Integration</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Next.js 14 + TypeScript</li>
                <li>✅ TailwindCSS + Framer Motion</li>
                <li>✅ Leaflet Maps</li>
                <li>✅ Responsive Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Elevate Your Code Quality?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Start reviewing code with enterprise-grade standards in minutes
        </p>
        <Link
          href="/code-forge"
          className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-lg"
        >
          Launch CodeForge
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  )
}

