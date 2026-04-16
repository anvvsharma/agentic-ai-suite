import { TestTube2, Upload, Code, Play } from 'lucide-react'

export default function TDDGeneratorPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <TestTube2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TDD Generator</h1>
            <p className="text-gray-600">Generate comprehensive test suites automatically</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tests Generated</span>
            <TestTube2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Coverage</span>
            <Code className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Passing</span>
            <Play className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Failing</span>
            <TestTube2 className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <TestTube2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            TDD Generator
          </h2>
          <p className="text-gray-600 mb-8">
            Automatically generate comprehensive test suites following Test-Driven Development principles.
            Upload your code or paste it directly to generate unit tests, integration tests, and more.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary inline-flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Code
            </button>
            <button className="btn-secondary inline-flex items-center gap-2">
              <Code className="w-5 h-5" />
              Paste Code
            </button>
          </div>

          {/* Features List */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <TestTube2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Unit Tests</h3>
                <p className="text-sm text-gray-600">Generate isolated unit tests for functions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Code className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Integration Tests</h3>
                <p className="text-sm text-gray-600">Test component interactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Edge Cases</h3>
                <p className="text-sm text-gray-600">Identify and test edge cases</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <TestTube2 className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Coverage Report</h3>
                <p className="text-sm text-gray-600">Detailed coverage analysis</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <TestTube2 className="w-4 h-4" />
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  )
}

