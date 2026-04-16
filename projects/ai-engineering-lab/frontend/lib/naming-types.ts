/**
 * TypeScript Types for Naming Conventions Feature
 */

export interface NamingExample {
  id: string
  description: string
  value: string
  isCorrect: boolean
  validationResult?: string
  explanation?: string
}

export interface ValidationRule {
  type: 'regex' | 'length' | 'reserved' | 'case' | 'custom'
  value: string | number | string[]
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface NamingConvention {
  id: string
  category: NamingCategory
  component: string
  field: string
  pattern: string
  description: string
  guidelines: string
  examples: NamingExample[]
  validationRules: ValidationRule[]
  maxLength?: number
  minLength?: number
  reservedWords: string[]
  caseSensitive: boolean
  allowSpaces: boolean
  status: 'active' | 'draft' | 'archived'
  usageCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
  tags: string[]
}

export type NamingCategory = 
  | 'integrations'
  | 'connections'
  | 'lookups'
  | 'packages'
  | 'projects'
  | 'agents'
  | 'libraries'
  | 'actions'

export interface CategoryInfo {
  id: NamingCategory
  label: string
  icon: string
  description: string
  conventionCount: number
  color: string
}

export interface PatternComponent {
  id: string
  label: string
  placeholder: string
  description: string
  required: boolean
  examples: string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  suggestions: string[]
  breakdown?: PatternBreakdown
}

export interface ValidationError {
  rule: string
  message: string
  position?: number
  suggestion?: string
}

export interface ValidationWarning {
  rule: string
  message: string
  suggestion?: string
}

export interface PatternBreakdown {
  components: {
    name: string
    value: string
    isValid: boolean
    description: string
  }[]
}

export interface UsageAnalytics {
  totalUsage: number
  recentUsage: number
  topUsers: string[]
  commonErrors: string[]
  successRate: number
}

export interface ConventionFilter {
  category?: NamingCategory
  status?: 'active' | 'draft' | 'archived'
  search?: string
  tags?: string[]
}

export interface ConventionSort {
  field: 'name' | 'usage' | 'updated' | 'created'
  direction: 'asc' | 'desc'
}

// UI State Types
export interface ExplorerState {
  selectedCategory: NamingCategory | null
  selectedConvention: string | null
  expandedCategories: NamingCategory[]
  searchQuery: string
  filter: ConventionFilter
}

export interface CanvasState {
  activeTab: string
  tabs: CanvasTab[]
  isDirty: boolean
  lastSaved?: string
}

export interface CanvasTab {
  id: string
  conventionId: string
  title: string
  isActive: boolean
  isDirty: boolean
}

export interface InspectorState {
  activeSection: 'properties' | 'validation' | 'usage' | 'related'
  isCollapsed: boolean
}

export interface CommandPaletteState {
  isOpen: boolean
  query: string
  selectedIndex: number
  commands: Command[]
}

export interface Command {
  id: string
  label: string
  description?: string
  shortcut?: string
  icon?: string
  action: () => void
  category: 'navigation' | 'editing' | 'view' | 'help'
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form Types
export interface ConventionFormData {
  category: NamingCategory
  component: string
  field: string
  pattern: string
  description: string
  guidelines: string
  examples: Omit<NamingExample, 'id'>[]
  validationRules: ValidationRule[]
  maxLength?: number
  minLength?: number
  reservedWords: string[]
  caseSensitive: boolean
  allowSpaces: boolean
  tags: string[]
}

export interface ImportOptions {
  format: 'json' | 'markdown' | 'csv'
  overwrite: boolean
  mergeStrategy: 'replace' | 'merge' | 'skip'
}

export interface ExportOptions {
  format: 'json' | 'markdown' | 'csv' | 'pdf'
  includeExamples: boolean
  includeAnalytics: boolean
  categories?: NamingCategory[]
}

