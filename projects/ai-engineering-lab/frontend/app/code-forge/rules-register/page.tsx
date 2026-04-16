'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen, Search, Plus, Edit, Trash2, Copy, Grid, List, 
  Minimize2, RefreshCw, X, AlertCircle, CheckCircle2, ArrowLeft
} from 'lucide-react'

// Types
interface Rule {
  rule_id: string
  name: string
  description: string
  category: string
  default_severity: string
  technology: string
  available_parameters: any[]
  examples: string[]
  references: string[]
}

interface Notification {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export default function RulesRegisterPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTechnology, setFilterTechnology] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'compact'>('card')
  
  // Modal states
  const [showRuleEditModal, setShowRuleEditModal] = useState(false)
  const [showRuleDeleteModal, setShowRuleDeleteModal] = useState(false)
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false)
  const [editingRegistryRule, setEditingRegistryRule] = useState<Rule | null>(null)
  const [deletingRegistryRule, setDeletingRegistryRule] = useState<Rule | null>(null)
  const [cloningRule, setCloningRule] = useState<Rule | null>(null)
  
  // New rule form state
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleDescription, setNewRuleDescription] = useState('')
  const [newRuleSeverity, setNewRuleSeverity] = useState('medium')
  const [newRuleCategory, setNewRuleCategory] = useState('code_structure')
  const [newRuleTechnology, setNewRuleTechnology] = useState('oic')
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchRules()
  }, [])

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/codeforge/rules')
      const data = await response.json()
      setRules(data.rules || [])
    } catch (error) {
      console.error('Failed to fetch rules:', error)
      addNotification('error', 'Failed to fetch rules')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRegistryRule = async () => {
    if (!editingRegistryRule) return

    try {
      const response = await fetch(`http://localhost:8000/api/codeforge/rules/${editingRegistryRule.rule_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRegistryRule)
      })

      if (response.ok) {
        addNotification('success', 'Rule updated successfully')
        setShowRuleEditModal(false)
        setEditingRegistryRule(null)
        fetchRules()
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to update rule')
      }
    } catch (error) {
      console.error('Failed to update rule:', error)
      addNotification('error', 'Failed to update rule')
    }
  }

  const handleDeleteRegistryRule = async () => {
    if (!deletingRegistryRule) return

    try {
      const response = await fetch(`http://localhost:8000/api/codeforge/rules/${deletingRegistryRule.rule_id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        addNotification('success', 'Rule deleted successfully')
        setShowRuleDeleteModal(false)
        setDeletingRegistryRule(null)
        fetchRules()
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to delete rule')
      }
    } catch (error) {
      console.error('Failed to delete rule:', error)
      addNotification('error', 'Failed to delete rule')
    }
  }

  const handleCreateNewRule = async () => {
    if (!newRuleName.trim()) {
      addNotification('error', 'Rule name is required')
      return
    }

    try {
      const ruleId = newRuleName.toLowerCase().replace(/[^a-z0-9]+/g, '_')
      
      const newRule = {
        rule_id: ruleId,
        name: newRuleName,
        description: newRuleDescription,
        category: newRuleCategory,
        default_severity: newRuleSeverity,
        technology: newRuleTechnology,
        available_parameters: [],
        examples: [],
        references: []
      }

      const response = await fetch('http://localhost:8000/api/codeforge/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      })

      if (response.ok) {
        addNotification('success', cloningRule ? 'Rule cloned successfully' : 'Rule created successfully')
        setShowCreateRuleModal(false)
        setCloningRule(null)
        setNewRuleName('')
        setNewRuleDescription('')
        setNewRuleSeverity('medium')
        setNewRuleCategory('code_structure')
        setNewRuleTechnology('oic')
        fetchRules()
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to create rule')
      }
    } catch (error) {
      console.error('Failed to create rule:', error)
      addNotification('error', 'Failed to create rule')
    }
  }

  const handleCloneRule = (rule: Rule) => {
    setCloningRule(rule)
    setNewRuleName(`${rule.name} (Copy)`)
    setNewRuleDescription(rule.description)
    setNewRuleSeverity(rule.default_severity)
    setNewRuleCategory(rule.category)
    setNewRuleTechnology(rule.technology)
    setShowCreateRuleModal(true)
  }

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTech = filterTechnology === 'all' || rule.technology === filterTechnology
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory
    const matchesSeverity = filterSeverity === 'all' || rule.default_severity === filterSeverity
    return matchesSearch && matchesTech && matchesCategory && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'info': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'error_handling': 'bg-red-50 text-red-700',
      'logging': 'bg-blue-50 text-blue-700',
      'performance': 'bg-green-50 text-green-700',
      'security': 'bg-purple-50 text-purple-700',
      'design_patterns': 'bg-indigo-50 text-indigo-700',
      'documentation': 'bg-cyan-50 text-cyan-700',
      'naming_conventions': 'bg-pink-50 text-pink-700',
      'code_structure': 'bg-amber-50 text-amber-700'
    }
    return colors[category] || 'bg-gray-50 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/code-forge" className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Rules Register</h1>
          </div>
          <p className="text-indigo-100">
            Manage and configure individual coding rules across technologies
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Rules Registry</h2>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Card View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'compact' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Compact View"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={fetchRules}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Refresh Rules"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                
                <button
                  onClick={() => {
                    setCloningRule(null)
                    setNewRuleName('')
                    setNewRuleDescription('')
                    setNewRuleSeverity('medium')
                    setNewRuleCategory('code_structure')
                    setNewRuleTechnology('oic')
                    setShowCreateRuleModal(true)
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Rule
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Technology Filter */}
              <select
                value={filterTechnology}
                onChange={(e) => setFilterTechnology(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Technologies</option>
                <option value="oic">OIC</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="error_handling">Error Handling</option>
                <option value="logging">Logging</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="design_patterns">Design Patterns</option>
                <option value="documentation">Documentation</option>
                <option value="naming_conventions">Naming Conventions</option>
                <option value="code_structure">Code Structure</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredRules.length} of {rules.length} rules
            </div>
          </div>

          {/* Rules Display */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading rules...</p>
            </div>
          ) : (
            <>
              {/* Card View */}
              {viewMode === 'card' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredRules.map((rule) => (
                    <div
                      key={rule.rule_id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
                    >
                      {/* Rule Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {rule.name}
                          </h3>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleCloneRule(rule)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Clone"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRegistryRule(rule)
                              setShowRuleEditModal(true)
                            }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingRegistryRule(rule)
                              setShowRuleDeleteModal(true)
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(rule.default_severity)}`}>
                          {rule.default_severity.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(rule.category)}`}>
                          {rule.category.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                          {rule.technology.toUpperCase()}
                        </span>
                      </div>

                      {/* Examples */}
                      {rule.examples && rule.examples.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {rule.examples.slice(0, 2).map((example, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-0.5">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* References */}
                      {rule.references && rule.references.length > 0 && (
                        <div className="mt-3">
                          <a
                            href={rule.references[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            View Documentation →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {filteredRules.map((rule, index) => (
                    <div
                      key={rule.rule_id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        index !== filteredRules.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-semibold text-gray-900">{rule.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getSeverityColor(rule.default_severity)}`}>
                              {rule.default_severity.toUpperCase()}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryColor(rule.category)}`}>
                              {rule.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700">
                              {rule.technology.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleCloneRule(rule)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Clone"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRegistryRule(rule)
                              setShowRuleEditModal(true)
                            }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingRegistryRule(rule)
                              setShowRuleDeleteModal(true)
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Compact View */}
              {viewMode === 'compact' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {filteredRules.map((rule) => (
                    <div
                      key={rule.rule_id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 flex-1">{rule.name}</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleCloneRule(rule)}
                            className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                            title="Clone"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRegistryRule(rule)
                              setShowRuleEditModal(true)
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingRegistryRule(rule)
                              setShowRuleDeleteModal(true)
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getSeverityColor(rule.default_severity)}`}>
                          {rule.default_severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700">
                          {rule.technology.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{rule.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Registry Rule Modal */}
      {showRuleEditModal && editingRegistryRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Rule</h3>
              <button onClick={() => setShowRuleEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={editingRegistryRule.name}
                  onChange={(e) => setEditingRegistryRule({...editingRegistryRule, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingRegistryRule.description}
                  onChange={(e) => setEditingRegistryRule({...editingRegistryRule, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Severity</label>
                <select
                  value={editingRegistryRule.default_severity}
                  onChange={(e) => setEditingRegistryRule({...editingRegistryRule, default_severity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="critical">CRITICAL</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                  <option value="info">INFO</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRuleEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRegistryRule}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Registry Rule Modal */}
      {showRuleDeleteModal && deletingRegistryRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Delete Rule</h3>
              <button onClick={() => setShowRuleDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">⚠️ Confirm Deletion</p>
                <p className="mt-1">This will permanently delete the rule from the registry.</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deletingRegistryRule.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRuleDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                No, Cancel
              </button>
              <button
                onClick={handleDeleteRegistryRule}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Rule Modal */}
      {showCreateRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {cloningRule ? 'Clone Rule' : 'Create New Rule'}
              </h3>
              <button onClick={() => setShowCreateRuleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cloningRule && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Cloning from: {cloningRule.name}</p>
                  <p className="mt-1">Modify the details below to create your custom rule.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Custom Validation Rule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newRuleDescription}
                  onChange={(e) => setNewRuleDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what this rule checks for..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                  <select
                    value={newRuleTechnology}
                    onChange={(e) => setNewRuleTechnology(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="oic">OIC</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={newRuleSeverity}
                    onChange={(e) => setNewRuleSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="critical">CRITICAL</option>
                    <option value="high">HIGH</option>
                    <option value="medium">MEDIUM</option>
                    <option value="low">LOW</option>
                    <option value="info">INFO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newRuleCategory}
                  onChange={(e) => setNewRuleCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="error_handling">Error Handling</option>
                  <option value="logging">Logging</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                  <option value="design_patterns">Design Patterns</option>
                  <option value="documentation">Documentation</option>
                  <option value="naming_conventions">Naming Conventions</option>
                  <option value="code_structure">Code Structure</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateRuleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewRule}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {cloningRule ? 'Clone Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

