'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Settings, Plus, Edit, Trash2, Copy, Download, Eye, Grid, List,
  Minimize2, X, AlertCircle, CheckCircle2, ArrowLeft, Save
} from 'lucide-react'

// Types
interface RuleSet {
  id: string
  name: string
  description: string
  technology: string
  total_rules: number
  enabled_rules: number
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

interface RuleConfig {
  rule_id: string
  enabled: boolean
  severity: string
  category: string
  name: string
  description: string
  parameters: Record<string, any>
  tags: string[]
}

interface Notification {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export default function RuleSetsPage() {
  const [rulesets, setRulesets] = useState<RuleSet[]>([])
  const [selectedRuleset, setSelectedRuleset] = useState<string | null>(null)
  const [rulesetRules, setRulesetRules] = useState<RuleConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [rulesetsViewMode, setRulesetsViewMode] = useState<'card' | 'list' | 'compact'>('card')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRuleConfigModal, setShowRuleConfigModal] = useState(false)
  const [editingRuleset, setEditingRuleset] = useState<RuleSet | null>(null)
  const [editingRule, setEditingRule] = useState<RuleConfig | null>(null)
  const [deletingRuleset, setDeletingRuleset] = useState<RuleSet | null>(null)
  
  // Form states
  const [newRulesetName, setNewRulesetName] = useState('')
  const [newRulesetDescription, setNewRulesetDescription] = useState('')
  const [newRulesetTechnology, setNewRulesetTechnology] = useState('oic')
  const [baseRulesetId, setBaseRulesetId] = useState<string>('')
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchRulesets()
  }, [])

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const fetchRulesets = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/codeforge/rulesets')
      const data = await response.json()
      setRulesets(data.rulesets || [])
    } catch (error) {
      console.error('Failed to fetch rulesets:', error)
      addNotification('error', 'Failed to fetch rulesets')
    }
  }

  const fetchRulesetRules = async (rulesetId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/codeforge/rulesets/${rulesetId}`)
      const data = await response.json()
      setRulesetRules(data.rules || [])
      setSelectedRuleset(rulesetId)
    } catch (error) {
      console.error('Failed to fetch ruleset rules:', error)
      addNotification('error', 'Failed to fetch ruleset rules')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRuleset = async () => {
    if (!newRulesetName.trim()) {
      addNotification('error', 'Ruleset name is required')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/codeforge/rulesets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRulesetName,
          description: newRulesetDescription,
          technology: newRulesetTechnology,
          base_ruleset_id: baseRulesetId || undefined
        })
      })

      if (response.ok) {
        addNotification('success', 'Ruleset created successfully')
        setShowCreateModal(false)
        setNewRulesetName('')
        setNewRulesetDescription('')
        setBaseRulesetId('')
        fetchRulesets()
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to create ruleset')
      }
    } catch (error) {
      console.error('Failed to create ruleset:', error)
      addNotification('error', 'Failed to create ruleset')
    }
  }

  const handleUpdateRuleset = async () => {
    if (!editingRuleset) return

    try {
      const response = await fetch(`http://localhost:8000/api/codeforge/rulesets/${editingRuleset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingRuleset.name,
          description: editingRuleset.description
        })
      })

      if (response.ok) {
        addNotification('success', 'Ruleset updated successfully')
        setShowEditModal(false)
        setEditingRuleset(null)
        fetchRulesets()
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to update ruleset')
      }
    } catch (error) {
      console.error('Failed to update ruleset:', error)
      addNotification('error', 'Failed to update ruleset')
    }
  }

  const handleDeleteRuleset = async () => {
    if (!deletingRuleset) return

    try {
      const response = await fetch(`http://localhost:8000/api/codeforge/rulesets/${deletingRuleset.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        addNotification('success', 'Ruleset deleted successfully')
        setShowDeleteModal(false)
        setDeletingRuleset(null)
        if (selectedRuleset === deletingRuleset.id) {
          setSelectedRuleset(null)
          setRulesetRules([])
        }
        fetchRulesets()
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to delete ruleset')
      }
    } catch (error) {
      console.error('Failed to delete ruleset:', error)
      addNotification('error', 'Failed to delete ruleset')
    }
  }

  const handleUpdateRule = async () => {
    if (!editingRule || !selectedRuleset) return

    try {
      const response = await fetch(
        `http://localhost:8000/api/codeforge/rulesets/${selectedRuleset}/rules/${editingRule.rule_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enabled: editingRule.enabled,
            severity: editingRule.severity,
            parameters: editingRule.parameters
          })
        }
      )

      if (response.ok) {
        addNotification('success', 'Rule updated successfully')
        setShowRuleConfigModal(false)
        setEditingRule(null)
        fetchRulesetRules(selectedRuleset)
      } else {
        const error = await response.json()
        addNotification('error', error.detail || 'Failed to update rule')
      }
    } catch (error) {
      console.error('Failed to update rule:', error)
      addNotification('error', 'Failed to update rule')
    }
  }

  const handleToggleRule = async (ruleId: string, currentEnabled: boolean) => {
    if (!selectedRuleset) return

    try {
      const response = await fetch(
        `http://localhost:8000/api/codeforge/rulesets/${selectedRuleset}/rules/${ruleId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !currentEnabled })
        }
      )

      if (response.ok) {
        addNotification('success', `Rule ${!currentEnabled ? 'enabled' : 'disabled'}`)
        fetchRulesetRules(selectedRuleset)
        fetchRulesets() // Update counts
      } else {
        addNotification('error', 'Failed to toggle rule')
      }
    } catch (error) {
      console.error('Failed to toggle rule:', error)
      addNotification('error', 'Failed to toggle rule')
    }
  }

  const handleExportRuleset = async (rulesetId: string, format: 'json' | 'yaml' = 'json') => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/codeforge/rulesets/${rulesetId}/export?format=${format}`
      )
      const data = await response.json()
      
      // Create download
      const blob = new Blob([data.data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.filename
      a.click()
      URL.revokeObjectURL(url)
      
      addNotification('success', 'Ruleset exported successfully')
    } catch (error) {
      console.error('Failed to export ruleset:', error)
      addNotification('error', 'Failed to export ruleset')
    }
  }

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
            <Settings className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Rule Sets</h1>
          </div>
          <p className="text-indigo-100">
            Manage collections of rules for different coding standards and projects
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Available Rule Sets</h2>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setRulesetsViewMode('card')}
                    className={`p-2 rounded transition-colors ${
                      rulesetsViewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Card View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRulesetsViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      rulesetsViewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRulesetsViewMode('compact')}
                    className={`p-2 rounded transition-colors ${
                      rulesetsViewMode === 'compact' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Compact View"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Rule Set
                </button>
              </div>
            </div>
          </div>

          {/* Rule Sets Display - Card View */}
          {rulesetsViewMode === 'card' && (
            <div className="grid md:grid-cols-3 gap-6">
            {rulesets.map((ruleset) => (
              <div
                key={ruleset.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {ruleset.name}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      {ruleset.is_default && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          DEFAULT
                        </span>
                      )}
                      {ruleset.is_system && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          SYSTEM
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{ruleset.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{ruleset.total_rules}</div>
                    <div className="text-xs text-gray-600">Total Rules</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{ruleset.enabled_rules}</div>
                    <div className="text-xs text-gray-600">Enabled</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => fetchRulesetRules(ruleset.id)}
                    className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                  >
                    View Rules
                  </button>
                  <button
                    onClick={() => {
                      setBaseRulesetId(ruleset.id)
                      setNewRulesetName(`${ruleset.name} (Custom)`)
                      setNewRulesetDescription(`Custom version of ${ruleset.name}`)
                      setNewRulesetTechnology(ruleset.technology)
                      setShowCreateModal(true)
                    }}
                    className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Clone"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingRuleset(ruleset)
                      setShowEditModal(true)
                    }}
                    className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingRuleset(ruleset)
                      setShowDeleteModal(true)
                    }}
                    className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportRuleset(ruleset.id)}
                    className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* List View */}
          {rulesetsViewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {rulesets.map((ruleset, index) => (
                <div
                  key={ruleset.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    index !== rulesets.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-gray-900">{ruleset.name}</h3>
                        {ruleset.is_default && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">DEFAULT</span>
                        )}
                        {ruleset.is_system && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">SYSTEM</span>
                        )}
                        <span className="text-sm text-gray-600">
                          {ruleset.enabled_rules}/{ruleset.total_rules} rules enabled
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{ruleset.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => fetchRulesetRules(ruleset.id)}
                        className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                      >
                        View Rules
                      </button>
                      <button
                        onClick={() => {
                          setBaseRulesetId(ruleset.id)
                          setNewRulesetName(`${ruleset.name} (Custom)`)
                          setNewRulesetDescription(`Custom version of ${ruleset.name}`)
                          setNewRulesetTechnology(ruleset.technology)
                          setShowCreateModal(true)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        title="Clone"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRuleset(ruleset)
                          setShowEditModal(true)
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingRuleset(ruleset)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
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
          {rulesetsViewMode === 'compact' && (
            <div className="grid md:grid-cols-4 gap-4">
              {rulesets.map((ruleset) => (
                <div
                  key={ruleset.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex-1">{ruleset.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => fetchRulesetRules(ruleset.id)}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRuleset(ruleset)
                          setShowEditModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingRuleset(ruleset)
                          setShowDeleteModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ruleset.is_default && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">DEFAULT</span>
                    )}
                    {ruleset.is_system && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">SYSTEM</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {ruleset.enabled_rules}/{ruleset.total_rules} enabled
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{ruleset.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Selected Ruleset Details */}
          {selectedRuleset && rulesetRules.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Rules in {rulesets.find(rs => rs.id === selectedRuleset)?.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedRuleset(null)
                    setRulesetRules([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {rulesetRules.map((rule) => {
                  const isSystemRuleset = rulesets.find(rs => rs.id === selectedRuleset)?.is_system
                  return (
                    <div
                      key={rule.rule_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => handleToggleRule(rule.rule_id, rule.enabled)}
                          className="cursor-pointer"
                          title="Toggle rule"
                        >
                          {rule.enabled ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {rule.name}
                            {isSystemRuleset && (
                              <span className="ml-2 text-xs text-blue-600 font-normal">(System)</span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(rule.severity)}`}>
                          {rule.severity.toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            setEditingRule(rule)
                            setShowRuleConfigModal(true)
                          }}
                          className="px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Configure"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Ruleset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Create New Rule Set</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newRulesetName}
                  onChange={(e) => setNewRulesetName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="My Custom Ruleset"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newRulesetDescription}
                  onChange={(e) => setNewRulesetDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Description of this ruleset..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                <select
                  value={newRulesetTechnology}
                  onChange={(e) => setNewRulesetTechnology(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="oic">OIC</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clone From (Optional)</label>
                <select
                  value={baseRulesetId}
                  onChange={(e) => setBaseRulesetId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Start Empty</option>
                  {rulesets.filter(rs => rs.technology === newRulesetTechnology).map(rs => (
                    <option key={rs.id} value={rs.id}>{rs.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRuleset}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ruleset Modal */}
      {showEditModal && editingRuleset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Rule Set</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingRuleset.is_system && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">⚠️ Editing System Ruleset</p>
                  <p className="mt-1">You are modifying a system ruleset. Changes will be saved permanently.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingRuleset.name}
                  onChange={(e) => setEditingRuleset({...editingRuleset, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingRuleset.description}
                  onChange={(e) => setEditingRuleset({...editingRuleset, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRuleset}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRuleset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Delete Rule Set</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {deletingRuleset.is_system && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">⚠️ Deleting System Ruleset</p>
                  <p className="mt-1">This is a system ruleset. Deleting it will remove the default configuration permanently.</p>
                </div>
              </div>
            )}

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deletingRuleset.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRuleset}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {deletingRuleset.is_system ? 'Delete Anyway' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rule Configuration Modal */}
      {showRuleConfigModal && editingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Configure Rule</h3>
              <button onClick={() => setShowRuleConfigModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {rulesets.find(rs => rs.id === selectedRuleset)?.is_system && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">⚠️ Modifying System Ruleset</p>
                  <p className="mt-1">You are editing a system ruleset. Changes will be saved. Consider cloning to a custom ruleset instead.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{editingRule.name}</h4>
                <p className="text-sm text-gray-600">{editingRule.description}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Enabled</span>
                <button
                  onClick={() => setEditingRule({...editingRule, enabled: !editingRule.enabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editingRule.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editingRule.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
                <select
                  value={editingRule.severity}
                  onChange={(e) => setEditingRule({...editingRule, severity: e.target.value})}
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
                onClick={() => setShowRuleConfigModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRule}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

