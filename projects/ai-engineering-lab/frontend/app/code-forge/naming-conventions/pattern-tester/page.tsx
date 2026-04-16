'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileCode, ArrowLeft, CheckCircle, XCircle, AlertCircle, Sparkles, Info } from 'lucide-react'

interface ValidationIssue {
  severity: string
  message: string
  current_value: string
  suggested_value: string | null
  pattern: string | null
  examples: string[]
}

interface ValidationResponse {
  valid: boolean
  artifact_type: string
  name: string
  issues: ValidationIssue[]
  suggestions: string[]
  pattern_info: {
    pattern: string
    description: string
    examples: string[]
    rules: string[]
  }
}

interface ArtifactType {
  value: string
  label: string
  description: string
}

export default function PatternTesterPage() {
  const [artifactTypes, setArtifactTypes] = useState<ArtifactType[]>([])
  const [selectedType, setSelectedType] = useState<string>('integration')
  const [artifactName, setArtifactName] = useState<string>('')
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typesLoaded, setTypesLoaded] = useState(false)

  // Load artifact types on mount
  useState(() => {
    if (!typesLoaded) {
      fetch('http://localhost:8000/api/codeforge/naming/artifact-types')
        .then(res => res.json())
        .then(data => {
          setArtifactTypes(data.artifact_types)
          setTypesLoaded(true)
        })
        .catch(err => console.error('Failed to load artifact types:', err))
    }
  })

  const handleValidate = async () => {
    if (!artifactName.trim()) {
      setError('Please enter an artifact name')
      return
    }

    setIsLoading(true)
    setError(null)
    setValidationResult(null)

    try {
      const response = await fetch('http://localhost:8000/api/codeforge/naming/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artifact_type: selectedType,
          name: artifactName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Validation request failed')
      }

      const data = await response.json()
      setValidationResult(data)
    } catch (err) {
      setError('Failed to validate artifact name. Please try again.')
      console.error('Validation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/code-forge/naming-conventions" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Pattern Tester</h1>
          </div>
          <p className="text-indigo-100">
            Test and validate artifact names against OIC naming conventions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h2>
              
              <div className="space-y-4">
                {/* Artifact Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artifact Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {artifactTypes.length > 0 ? (
                      artifactTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="integration">Integration</option>
                        <option value="connection">Connection</option>
                        <option value="lookup">Lookup</option>
                        <option value="package">Package</option>
                        <option value="project">Project</option>
                        <option value="agent">Agent</option>
                        <option value="library">Library</option>
                        <option value="action">Action</option>
                      </>
                    )}
                  </select>
                  {artifactTypes.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {artifactTypes.find(t => t.value === selectedType)?.description}
                    </p>
                  )}
                </div>

                {/* Artifact Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artifact Name
                  </label>
                  <input
                    type="text"
                    value={artifactName}
                    onChange={(e) => setArtifactName(e.target.value)}
                    placeholder="Enter artifact name to test..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                  />
                </div>

                {/* Validate Button */}
                <button
                  onClick={handleValidate}
                  disabled={isLoading || !artifactName.trim()}
                  className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Validate Name
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {validationResult ? (
              <div className="space-y-6">
                {/* Validation Status */}
                <div className={`rounded-lg p-6 border-2 ${
                  validationResult.valid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {validationResult.valid ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 ${
                        validationResult.valid ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {validationResult.valid ? 'Valid Name' : 'Invalid Name'}
                      </h3>
                      <p className={`text-sm ${
                        validationResult.valid ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {validationResult.valid 
                          ? `"${validationResult.name}" follows the naming conventions for ${validationResult.artifact_type}.`
                          : `"${validationResult.name}" does not follow the naming conventions for ${validationResult.artifact_type}.`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {validationResult.issues.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Issues Found ({validationResult.issues.length})
                    </h3>
                    <div className="space-y-3">
                      {validationResult.issues.map((issue, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-xs font-semibold uppercase px-2 py-1 rounded">
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-2">{issue.message}</p>
                          {issue.suggested_value && (
                            <div className="mt-2 p-2 bg-white/50 rounded border border-current/20">
                              <p className="text-xs font-medium mb-1">Suggested:</p>
                              <code className="text-sm font-mono">{issue.suggested_value}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {validationResult.suggestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {validationResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <code className="text-sm font-mono text-indigo-900">{suggestion}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pattern Information */}
                {validationResult.pattern_info && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Pattern Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{validationResult.pattern_info.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Pattern</h4>
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {validationResult.pattern_info.pattern}
                        </code>
                      </div>

                      {validationResult.pattern_info.rules.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Rules</h4>
                          <ul className="space-y-1">
                            {validationResult.pattern_info.rules.map((rule, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-indigo-600 mt-1">•</span>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validationResult.pattern_info.examples.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Examples</h4>
                          <div className="space-y-1">
                            {validationResult.pattern_info.examples.map((example, index) => (
                              <code key={index} className="block text-xs font-mono bg-green-50 text-green-800 px-2 py-1 rounded">
                                {example}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                  <FileCode className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Test
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select an artifact type and enter a name to validate it against OIC naming conventions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

