'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap, Upload, Code2, Play, AlertCircle, CheckCircle2,
  Info, FileText, BarChart3, Download, Copy, Check, Shield,
  TrendingUp, Activity, Filter, Search, X, ChevronDown, ChevronUp,
  ExternalLink, Settings, ArrowLeft
} from 'lucide-react'
import codeforgeApi from '@/lib/codeforge-api'
import {
  Technology,
  AnalyzeCodeResponse,
  Issue,
  Severity,
  SEVERITY_CONFIG,
  CATEGORY_LABELS,
  TECHNOLOGY_LABELS,
  Stats
} from '@/lib/codeforge-types'
import NamingReportTable from '@/components/naming/NamingReportTable'

export default function CodeReviewPage() {
  const [code, setCode] = useState('')
  const [technology, setTechnology] = useState<Technology>(Technology.PYTHON)
  const [fileName, setFileName] = useState('untitled.py')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalyzeCodeResponse | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [namingReport, setNamingReport] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<'issues' | 'naming'>('issues')
  const [selectedRuleset, setSelectedRuleset] = useState<string>('oic_standard')
  const [rulesets, setRulesets] = useState<any[]>([])

  useEffect(() => {
    loadStats()
    loadSampleCode()
    loadRulesets()
  }, [])

  useEffect(() => {
    loadRulesets()
  }, [technology])

  const loadStats = async () => {
    try {
      const data = await codeforgeApi.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadRulesets = async () => {
    try {
      const data = await codeforgeApi.listRulesets(technology)
      setRulesets(data.rulesets || [])
      // Set default ruleset based on technology
      if (data.rulesets && data.rulesets.length > 0) {
        const defaultRuleset = data.rulesets.find((rs: any) => rs.is_default) || data.rulesets[0]
        setSelectedRuleset(defaultRuleset.id)
      }
    } catch (error) {
      console.error('Failed to load rulesets:', error)
    }
  }

  const loadSampleCode = async (tech?: Technology) => {
    try {
      const samples = await codeforgeApi.getSampleCode()
      const selectedTech = tech || technology
      
      if (selectedTech === Technology.PYTHON) {
        setCode(samples.python)
      } else if (selectedTech === Technology.JAVASCRIPT) {
        setCode(samples.javascript)
      } else {
        setCode('')
      }
    } catch (error) {
      console.error('Failed to load sample code:', error)
    }
  }

  const handleTechnologyChange = (newTech: Technology) => {
    setTechnology(newTech)
    setIsFileUploaded(false)
    setResult(null)
    
    // Update filename based on technology
    const extensions: Record<Technology, string> = {
      [Technology.PYTHON]: 'untitled.py',
      [Technology.JAVASCRIPT]: 'untitled.js',
      [Technology.NODEJS]: 'untitled.js',
      [Technology.NEXTJS]: 'untitled.tsx',
      [Technology.JAVA]: 'Untitled.java',
      [Technology.PLSQL]: 'untitled.sql',
      [Technology.OIC]: 'untitled.iar',
    }
    setFileName(extensions[newTech] || 'untitled.txt')
    
    // Load sample code for the selected technology
    loadSampleCode(newTech)
  }

  const handleAnalyze = async () => {
    // If file was uploaded and analyzed, don't re-analyze
    if (isFileUploaded && result) {
      return
    }

    if (!code.trim()) {
      alert('Please enter some code to analyze')
      return
    }

    setIsAnalyzing(true)
    setResult(null)
    setSelectedIssue(null)

    try {
      const response = await codeforgeApi.analyzeCode({
        technology,
        code,
        file_name: fileName
      })
      setResult(response)
      
      // Fetch naming report for OIC analyses
      if (technology === Technology.OIC && response.review_id) {
        try {
          const report = await codeforgeApi.getNamingReport(response.review_id)
          setNamingReport(report)
          // Switch to naming tab if report has data
          if (report && report.summary && report.summary.naming_issues > 0) {
            setActiveTab('naming')
          }
        } catch (error) {
          console.error('Failed to load naming report:', error)
          // Don't fail the whole analysis if naming report fails
        }
      } else {
        setNamingReport(null)
      }
      
      loadStats()
    } catch (error: any) {
      console.error('Analysis failed:', error)
      alert(`Analysis failed: ${error.response?.data?.detail || error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsFileUploaded(false)
    
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'py') setTechnology(Technology.PYTHON)
    else if (ext === 'js') setTechnology(Technology.JAVASCRIPT)
    else if (ext === 'java') setTechnology(Technology.JAVA)
    else if (ext === 'iar') setTechnology(Technology.OIC)
    
    if (ext === 'iar') {
      setIsAnalyzing(true)
      setResult(null)
      setCode('Analyzing .iar package...')
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('technology', Technology.OIC)
        
        const response = await fetch('http://localhost:8000/api/codeforge/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) throw new Error('Upload failed')
        
        const data = await response.json()
        
        if (data.analysis_result) {
          setResult(data.analysis_result)
          setIsFileUploaded(true)
          setCode(`✅ Analysis Complete!\n\n📦 File: ${file.name}\n🔍 Issues Found: ${data.issues_found}\n\nSee results below ⬇️`)
          
          // Fetch naming report for OIC files
          if (data.analysis_result.review_id) {
            try {
              const report = await codeforgeApi.getNamingReport(data.analysis_result.review_id)
              setNamingReport(report)
              // Switch to naming tab if report has data
              if (report && report.summary && report.summary.naming_issues > 0) {
                setActiveTab('naming')
              }
            } catch (error) {
              console.error('Failed to load naming report:', error)
            }
          }
        }
        
        loadStats()
      } catch (error: any) {
        console.error('Upload failed:', error)
        alert(`Upload failed: ${error.message}`)
        setCode('')
        setIsFileUploaded(false)
      } finally {
        setIsAnalyzing(false)
      }
    } else {
      setIsFileUploaded(false)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
      }
      reader.readAsText(file)
    }
  }

  const copySuggestion = (issue: Issue) => {
    if (issue.suggested_value) {
      navigator.clipboard.writeText(issue.suggested_value)
      setCopiedId(issue.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const getSeverityIcon = (severity: Severity) => {
    const config = SEVERITY_CONFIG[severity]
    return config.icon
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const filteredIssues = result?.issues.filter(issue => {
    const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity
    const matchesSearch = searchQuery === '' ||
      issue.violation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      CATEGORY_LABELS[issue.category].toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesSearch
  }) || []

  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    const category = CATEGORY_LABELS[issue.category]
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(issue)
    return acc
  }, {} as Record<string, Issue[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-3">
              <Link href="/code-forge" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <Zap className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Code Review</h1>
            </div>
          </div>
          <p className="text-indigo-100">
            AI-powered code analysis with real-time feedback and enterprise-grade standards
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <Code2 className="w-4 h-4 text-indigo-600" />
                Code Input
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={technology}
                    onChange={(e) => handleTechnologyChange(e.target.value as Technology)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    {Object.entries(TECHNOLOGY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="File name"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  
                  <label className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 transition-all border border-gray-300">
                    <Upload className="w-4 h-4" />
                    Upload
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".py,.js,.java,.iar"
                    />
                  </label>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here or upload a file..."
                  className="w-full h-80 px-3 py-3 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50"
                />

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !code.trim() || isFileUploaded}
                  className="w-full px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : isFileUploaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      File Analyzed
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Analyze Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3">
            {result && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="mb-4">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    Analysis Results
                  </h2>
                </div>

                {/* Tabs for OIC analyses with naming report */}
                {technology === Technology.OIC && namingReport && (
                  <div className="flex gap-2 mb-4 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('issues')}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'issues'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Code Issues ({result.summary.total_issues})
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('naming')}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'naming'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Naming Report ({namingReport.summary?.naming_issues || 0})
                      </div>
                    </button>
                  </div>
                )}

                {/* Issues Tab Content */}
                {activeTab === 'issues' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                      <p className="text-3xl font-bold text-indigo-600">{result.summary.total_issues}</p>
                      <p className="text-xs text-gray-600 mt-1">Total Issues</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <p className="text-3xl font-bold text-blue-600">{result.summary.total_lines}</p>
                      <p className="text-xs text-gray-600 mt-1">Lines Analyzed</p>
                    </div>
                  </div>

                  {/* Severity Breakdown */}
                  <div className="space-y-1.5">
                    {result.summary.critical_severity > 0 && (
                      <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <span className="text-sm font-semibold text-red-900">Critical</span>
                        <span className="text-lg font-bold text-red-900">{result.summary.critical_severity}</span>
                      </div>
                    )}
                    {result.summary.high_severity > 0 && (
                      <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <span className="text-sm font-semibold text-orange-900">High</span>
                        <span className="text-lg font-bold text-orange-900">{result.summary.high_severity}</span>
                      </div>
                    )}
                    {result.summary.medium_severity > 0 && (
                      <div className="flex items-center justify-between p-2.5 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <span className="text-sm font-semibold text-yellow-900">Medium</span>
                        <span className="text-lg font-bold text-yellow-900">{result.summary.medium_severity}</span>
                      </div>
                    )}
                    {result.summary.low_severity > 0 && (
                      <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <span className="text-sm font-semibold text-blue-900">Low</span>
                        <span className="text-lg font-bold text-blue-900">{result.summary.low_severity}</span>
                      </div>
                    )}
                  </div>

                  {/* Issues List */}
                  {filteredIssues.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">Issues Found</h3>
                      {Object.entries(groupedIssues).map(([category, issues]) => (
                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleCategory(category)}
                            className="w-full px-3 py-2.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                          >
                            <span className="text-sm font-semibold text-gray-700">{category} ({issues.length})</span>
                            {expandedCategories.has(category) ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          {expandedCategories.has(category) && (
                            <div className="p-3 space-y-2 bg-gray-50">
                              {issues.map((issue) => (
                                <div key={issue.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${SEVERITY_CONFIG[issue.severity].bgColor} ${SEVERITY_CONFIG[issue.severity].color}`}>
                                          {issue.severity}
                                        </span>
                                        <span className="text-xs font-medium text-gray-900">{issue.violation}</span>
                                      </div>
                                      <p className="text-xs text-gray-600 leading-relaxed">{issue.description}</p>
                                      {issue.line_number && (
                                        <p className="text-xs text-gray-500 mt-1">Line {issue.line_number}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                )}

                {/* Naming Report Tab Content */}
                {activeTab === 'naming' && namingReport && (
                  <div className="space-y-4">
                    <NamingReportTable data={namingReport} />
                  </div>
                )}
              </div>
            )}

            {!result && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
                <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">No analysis results yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload code and click Analyze to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

