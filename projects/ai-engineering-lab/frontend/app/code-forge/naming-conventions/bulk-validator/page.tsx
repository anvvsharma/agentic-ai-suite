'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileSpreadsheet, ArrowLeft, Upload, Plus, Trash2, Download, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react'

interface ValidationItem {
  id: string
  artifact_type: string
  name: string
}

interface ValidationResult {
  artifact_type: string
  name: string
  valid: boolean
  issues_count: number
  issues: {
    severity: string
    message: string
    current_value: string
    suggested_value: string | null
  }[]
}

interface BulkValidationResponse {
  total: number
  valid: number
  invalid: number
  results: ValidationResult[]
}

export default function BulkValidatorPage() {
  const [items, setItems] = useState<ValidationItem[]>([
    { id: '1', artifact_type: 'integration', name: '' }
  ])
  const [validationResults, setValidationResults] = useState<BulkValidationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'invalid'>('all')

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

  const addItem = () => {
    const newId = (Math.max(...items.map(i => parseInt(i.id)), 0) + 1).toString()
    setItems([...items, { id: newId, artifact_type: 'integration', name: '' }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: 'artifact_type' | 'name', value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleValidate = async () => {
    const validItems = items.filter(item => item.name.trim())
    
    if (validItems.length === 0) {
      setError('Please add at least one artifact name')
      return
    }

    setIsLoading(true)
    setError(null)
    setValidationResults(null)

    try {
      const response = await fetch('http://localhost:8000/api/codeforge/naming/validate-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: validItems.map(item => ({
            artifact_type: item.artifact_type,
            name: item.name.trim()
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Validation request failed')
      }

      const data = await response.json()
      setValidationResults(data)
    } catch (err) {
      setError('Failed to validate artifacts. Please try again.')
      console.error('Validation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      // Skip header if present
      const startIndex = lines[0].toLowerCase().includes('type') || lines[0].toLowerCase().includes('artifact') ? 1 : 0
      
      const newItems: ValidationItem[] = []
      for (let i = startIndex; i < lines.length; i++) {
        const [type, name] = lines[i].split(',').map(s => s.trim())
        if (type && name) {
          newItems.push({
            id: (i + 1).toString(),
            artifact_type: type.toLowerCase(),
            name: name
          })
        }
      }

      if (newItems.length > 0) {
        setItems(newItems)
        setError(null)
      } else {
        setError('No valid items found in CSV file')
      }
    }
    reader.readAsText(file)
  }

  const exportToCSV = () => {
    if (!validationResults) return

    const headers = ['Artifact Type', 'Name', 'Status', 'Issues Count', 'Issues']
    const rows = validationResults.results.map(result => [
      result.artifact_type,
      result.name,
      result.valid ? 'Valid' : 'Invalid',
      result.issues_count.toString(),
      result.issues.map(i => i.message).join('; ')
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `naming-validation-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredResults = validationResults?.results.filter(result => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'valid') return result.valid
    if (filterStatus === 'invalid') return !result.valid
    return true
  })

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
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
            <FileSpreadsheet className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Bulk Validator</h1>
          </div>
          <p className="text-indigo-100">
            Validate multiple artifact names at once and export compliance reports
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Artifacts</h2>
              
              {/* CSV Import */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import from CSV
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Choose CSV file</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVImport}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Format: artifact_type,name (one per line)
                </p>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Manual Entry */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <select
                        value={item.artifact_type}
                        onChange={(e) => updateItem(item.id, 'artifact_type', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {artifactTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Artifact name..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>

              {/* Validate Button */}
              <button
                onClick={handleValidate}
                disabled={isLoading || items.every(item => !item.name.trim())}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Validate All
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {validationResults ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Validation Summary</h3>
                    <button
                      onClick={exportToCSV}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">{validationResults.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{validationResults.valid}</div>
                      <div className="text-sm text-gray-600">Valid</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{validationResults.invalid}</div>
                      <div className="text-sm text-gray-600">Invalid</div>
                    </div>
                  </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1 text-sm rounded ${
                          filterStatus === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All ({validationResults.total})
                      </button>
                      <button
                        onClick={() => setFilterStatus('valid')}
                        className={`px-3 py-1 text-sm rounded ${
                          filterStatus === 'valid'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Valid ({validationResults.valid})
                      </button>
                      <button
                        onClick={() => setFilterStatus('invalid')}
                        className={`px-3 py-1 text-sm rounded ${
                          filterStatus === 'invalid'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Invalid ({validationResults.invalid})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Issues</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredResults?.map((result, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {result.valid ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {result.artifact_type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <code className="text-sm font-mono text-gray-900">{result.name}</code>
                            </td>
                            <td className="px-4 py-3">
                              {result.issues_count > 0 ? (
                                <div className="space-y-1">
                                  {result.issues.map((issue, issueIndex) => (
                                    <div key={issueIndex} className="text-xs">
                                      <span className={`font-semibold ${getSeverityColor(issue.severity)}`}>
                                        {issue.severity.toUpperCase()}:
                                      </span>
                                      <span className="text-gray-600 ml-1">{issue.message}</span>
                                      {issue.suggested_value && (
                                        <div className="mt-1 text-green-700">
                                          → Suggested: <code className="font-mono">{issue.suggested_value}</code>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-green-600">No issues</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Validate
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Add artifact names manually or import from CSV, then click "Validate All" to check compliance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

