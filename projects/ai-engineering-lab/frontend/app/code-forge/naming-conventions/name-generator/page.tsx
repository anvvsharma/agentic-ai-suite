'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Copy, CheckCircle, RefreshCw } from 'lucide-react'

interface GeneratedName {
  name: string
  identifier?: string
  version?: string
  components: Record<string, string>
  suggestions: string[]
}

export default function NameGeneratorPage() {
  const [artifactType, setArtifactType] = useState('integration')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generatedName, setGeneratedName] = useState<GeneratedName | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const artifactTypes = [
    { value: 'integration', label: 'Integration' },
    { value: 'connection', label: 'Connection' },
    { value: 'lookup', label: 'Lookup' },
    { value: 'package', label: 'Package' },
    { value: 'project', label: 'Project' },
    { value: 'agent', label: 'Agent' },
    { value: 'library', label: 'Library' },
    { value: 'action', label: 'Action' }
  ]

  const formFields: Record<string, Array<{name: string, label: string, placeholder: string, required: boolean}>> = {
    integration: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'BCRX', required: true },
      { name: 'source_system', label: 'Source System', placeholder: 'ERP', required: true },
      { name: 'target_system', label: 'Target System', placeholder: 'CRM', required: true },
      { name: 'business_object', label: 'Business Object', placeholder: 'Customer', required: true },
      { name: 'integration_type', label: 'Integration Type', placeholder: 'INT, SCH, SUB, RT', required: false }
    ],
    connection: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'BCRX', required: true },
      { name: 'adapter_type', label: 'Adapter Type', placeholder: 'REST, SOAP, SFTP, DB', required: true },
      { name: 'system_name', label: 'System Name', placeholder: 'ERP', required: true }
    ],
    lookup: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'BCRX', required: true },
      { name: 'source_system', label: 'Source System', placeholder: 'ERP', required: true },
      { name: 'purpose', label: 'Purpose', placeholder: 'CMN_INT', required: true }
    ],
    package: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'bcrx', required: true },
      { name: 'project_code', label: 'Project Code (3 chars)', placeholder: 'erp', required: true },
      { name: 'module', label: 'Module', placeholder: 'im', required: true }
    ],
    project: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'bcrx', required: true },
      { name: 'project_code', label: 'Project Code (3 chars)', placeholder: 'erp', required: true },
      { name: 'module', label: 'Module', placeholder: 'im', required: true }
    ],
    agent: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'BCRX', required: true },
      { name: 'system_name', label: 'System Name', placeholder: 'EBS', required: true },
      { name: 'adapter_type', label: 'Adapter Type', placeholder: 'DB, SFTP', required: true }
    ],
    library: [
      { name: 'org_code', label: 'Organization Code', placeholder: 'BCRX', required: true },
      { name: 'functionality', label: 'Functionality', placeholder: 'DATETIME_FORMATTER', required: true }
    ],
    action: [
      { name: 'action_type', label: 'Action Type', placeholder: 'assign, b2b, data_stitch, map', required: true },
      { name: 'description', label: 'Description', placeholder: 'UpdatePhoneNumber', required: true }
    ]
  }

  const handleGenerate = async () => {
    const fields = formFields[artifactType]
    const requiredFields = fields.filter(f => f.required)
    const missingFields = requiredFields.filter(f => !formData[f.name]?.trim())

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedName(null)

    try {
      const params = new URLSearchParams()
      params.append('artifact_type', artifactType)
      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim()) {
          params.append(key, value.trim())
        }
      })

      const response = await fetch(`http://localhost:8000/api/codeforge/naming/generate?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMsg = typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail)
        throw new Error(errorMsg || 'Generation failed')
      }

      const data = await response.json()
      setGeneratedName(data)
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate name. Please try again.'
      setError(errorMessage)
      console.error('Generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setFormData({})
    setGeneratedName(null)
    setError(null)
  }

  const handleTypeChange = (newType: string) => {
    setArtifactType(newType)
    setFormData({})
    setGeneratedName(null)
    setError(null)
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
            <h1 className="text-3xl font-bold">Name Generator</h1>
          </div>
          <p className="text-indigo-100">
            Generate compliant OIC artifact names based on your inputs
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
              
              {/* Artifact Type Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artifact Type
                </label>
                <select
                  value={artifactType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {artifactTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Form Fields */}
              <div className="space-y-3">
                {formFields[artifactType]?.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Name
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {generatedName ? (
              <div className="space-y-6">
                {/* Generated Name */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Name</h3>
                    <button
                      onClick={() => handleCopy(generatedName.name)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200">
                    <code className="text-lg font-mono text-indigo-900 break-all">
                      {generatedName.name}
                    </code>
                  </div>

                  {generatedName.identifier && generatedName.identifier !== generatedName.name && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Identifier</h4>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <code className="text-sm font-mono text-gray-900">
                          {generatedName.identifier}
                        </code>
                      </div>
                    </div>
                  )}

                  {generatedName.version && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Version</h4>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <code className="text-sm font-mono text-gray-900">
                          {generatedName.version}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                {/* Components Breakdown */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Components</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(generatedName.components).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <code className="text-sm font-mono text-gray-900">{value}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {generatedName.suggestions && generatedName.suggestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips & Guidelines</h3>
                    <ul className="space-y-2">
                      {generatedName.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    href={`/code-forge/naming-conventions/pattern-tester?type=${artifactType}&name=${encodeURIComponent(generatedName.name)}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 border border-gray-200 group"
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      Validate This Name
                    </h4>
                    <p className="text-xs text-gray-600">
                      Test the generated name in Pattern Tester
                    </p>
                  </Link>

                  <Link
                    href="/code-forge/naming-conventions/pattern-guide"
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 border border-gray-200 group"
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      View Pattern Guide
                    </h4>
                    <p className="text-xs text-gray-600">
                      Learn more about naming conventions
                    </p>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Fill in the required fields and click "Generate Name" to create a compliant artifact name.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

