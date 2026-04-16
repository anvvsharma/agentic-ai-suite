/**
 * Naming Conventions Service
 * Handles CRUD operations and business logic for naming conventions
 */

import { NamingConvention, NamingCategory, ConventionFormData, ExportOptions, ImportOptions } from './naming-types'
import { namingConventionsData, getConventionsByCategory, getConventionById, searchConventions } from './naming-conventions-data'
import { validationEngine } from './validation-engine'

class NamingConventionsService {
  private conventions: NamingConvention[] = [...namingConventionsData]
  private listeners: Set<() => void> = new Set()

  /**
   * Subscribe to convention changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of changes
   */
  private notify(): void {
    this.listeners.forEach(listener => listener())
  }

  /**
   * Get all conventions
   */
  getAllConventions(): NamingConvention[] {
    return [...this.conventions]
  }

  /**
   * Get conventions by category
   */
  getConventionsByCategory(category: NamingCategory): NamingConvention[] {
    return this.conventions.filter(conv => conv.category === category)
  }

  /**
   * Get convention by ID
   */
  getConventionById(id: string): NamingConvention | undefined {
    return this.conventions.find(conv => conv.id === id)
  }

  /**
   * Search conventions
   */
  searchConventions(query: string): NamingConvention[] {
    const lowerQuery = query.toLowerCase()
    return this.conventions.filter(conv =>
      conv.field.toLowerCase().includes(lowerQuery) ||
      conv.description.toLowerCase().includes(lowerQuery) ||
      conv.pattern.toLowerCase().includes(lowerQuery) ||
      conv.component.toLowerCase().includes(lowerQuery) ||
      conv.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Create a new convention
   */
  createConvention(data: ConventionFormData): NamingConvention {
    const newConvention: NamingConvention = {
      id: this.generateId(),
      ...data,
      examples: data.examples.map((ex, idx) => ({
        ...ex,
        id: `ex-${Date.now()}-${idx}`
      })),
      status: 'active',
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user'
    }

    this.conventions.push(newConvention)
    this.notify()
    return newConvention
  }

  /**
   * Update an existing convention
   */
  updateConvention(id: string, data: Partial<NamingConvention>): NamingConvention | null {
    const index = this.conventions.findIndex(conv => conv.id === id)
    if (index === -1) return null

    const updatedConvention: NamingConvention = {
      ...this.conventions[index],
      ...data,
      examples: data.examples
        ? data.examples.map((ex, idx) => ({
            ...ex,
            id: ex.id || `ex-${Date.now()}-${idx}`
          }))
        : this.conventions[index].examples,
      updatedAt: new Date().toISOString()
    }

    this.conventions[index] = updatedConvention
    this.notify()
    return updatedConvention
  }

  /**
   * Delete a convention
   */
  deleteConvention(id: string): boolean {
    const index = this.conventions.findIndex(conv => conv.id === id)
    if (index === -1) return false

    this.conventions.splice(index, 1)
    this.notify()
    return true
  }

  /**
   * Archive a convention
   */
  archiveConvention(id: string): boolean {
    const convention = this.getConventionById(id)
    if (!convention) return false

    return this.updateConvention(id, { status: 'archived' }) !== null
  }

  /**
   * Activate a convention
   */
  activateConvention(id: string): boolean {
    const convention = this.getConventionById(id)
    if (!convention) return false

    return this.updateConvention(id, { status: 'active' }) !== null
  }

  /**
   * Duplicate a convention
   */
  duplicateConvention(id: string): NamingConvention | null {
    const convention = this.getConventionById(id)
    if (!convention) return null

    const duplicated: NamingConvention = {
      ...convention,
      id: this.generateId(),
      field: `${convention.field} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    }

    this.conventions.push(duplicated)
    this.notify()
    return duplicated
  }

  /**
   * Validate a value against a convention
   */
  validateValue(conventionId: string, value: string) {
    const convention = this.getConventionById(conventionId)
    if (!convention) {
      throw new Error('Convention not found')
    }

    return validationEngine.validatePattern(convention.pattern, value, {
      maxLength: convention.maxLength,
      minLength: convention.minLength,
      reservedWords: convention.reservedWords,
      caseSensitive: convention.caseSensitive,
      allowSpaces: convention.allowSpaces
    })
  }

  /**
   * Get category statistics
   */
  getCategoryStats() {
    const categories: NamingCategory[] = [
      'integrations',
      'connections',
      'lookups',
      'packages',
      'projects',
      'agents',
      'libraries',
      'actions'
    ]

    return categories.map(category => {
      const conventions = this.getConventionsByCategory(category)
      return {
        category,
        total: conventions.length,
        active: conventions.filter(c => c.status === 'active').length,
        draft: conventions.filter(c => c.status === 'draft').length,
        archived: conventions.filter(c => c.status === 'archived').length
      }
    })
  }

  /**
   * Export conventions
   */
  exportConventions(options: ExportOptions): string {
    let conventions = this.conventions

    // Filter by categories if specified
    if (options.categories && options.categories.length > 0) {
      conventions = conventions.filter(conv => 
        options.categories!.includes(conv.category)
      )
    }

    // Filter out examples if not included
    if (!options.includeExamples) {
      conventions = conventions.map(conv => ({
        ...conv,
        examples: []
      }))
    }

    switch (options.format) {
      case 'json':
        return JSON.stringify(conventions, null, 2)
      
      case 'csv':
        return this.exportToCSV(conventions)
      
      case 'markdown':
        return this.exportToMarkdown(conventions, options.includeExamples)
      
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  /**
   * Import conventions
   */
  importConventions(data: string, options: ImportOptions): number {
    let importedConventions: NamingConvention[]

    try {
      switch (options.format) {
        case 'json':
          importedConventions = JSON.parse(data)
          break
        
        case 'csv':
          importedConventions = this.importFromCSV(data)
          break
        
        case 'markdown':
          importedConventions = this.importFromMarkdown(data)
          break
        
        default:
          throw new Error(`Unsupported import format: ${options.format}`)
      }

      let importedCount = 0

      importedConventions.forEach(convention => {
        const existing = this.getConventionById(convention.id)

        if (existing) {
          switch (options.mergeStrategy) {
            case 'replace':
              if (options.overwrite) {
                this.updateConvention(convention.id, convention)
                importedCount++
              }
              break
            
            case 'merge':
              this.updateConvention(convention.id, {
                ...existing,
                ...convention,
                examples: [...existing.examples, ...convention.examples]
              })
              importedCount++
              break
            
            case 'skip':
              // Skip existing conventions
              break
          }
        } else {
          // New convention
          convention.id = this.generateId()
          this.conventions.push(convention)
          importedCount++
        }
      })

      this.notify()
      return importedCount
    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Reset to default conventions
   */
  resetToDefaults(): void {
    this.conventions = [...namingConventionsData]
    this.notify()
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(conventions: NamingConvention[]): string {
    const headers = [
      'ID',
      'Category',
      'Component',
      'Field',
      'Pattern',
      'Description',
      'Max Length',
      'Min Length',
      'Case Sensitive',
      'Allow Spaces',
      'Status',
      'Tags'
    ]

    const rows = conventions.map(conv => [
      conv.id,
      conv.category,
      conv.component,
      conv.field,
      conv.pattern,
      conv.description,
      conv.maxLength || '',
      conv.minLength || '',
      conv.caseSensitive,
      conv.allowSpaces,
      conv.status,
      conv.tags.join(';')
    ])

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
  }

  /**
   * Export to Markdown format
   */
  private exportToMarkdown(conventions: NamingConvention[], includeExamples: boolean): string {
    let markdown = '# Naming Conventions\n\n'
    
    const categories = [...new Set(conventions.map(c => c.category))]
    
    categories.forEach(category => {
      markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`
      
      const categoryConventions = conventions.filter(c => c.category === category)
      
      categoryConventions.forEach(conv => {
        markdown += `### ${conv.component} - ${conv.field}\n\n`
        markdown += `**Pattern:** \`${conv.pattern}\`\n\n`
        markdown += `**Description:** ${conv.description}\n\n`
        
        if (conv.maxLength) {
          markdown += `**Max Length:** ${conv.maxLength}\n\n`
        }
        
        if (includeExamples && conv.examples.length > 0) {
          markdown += `**Examples:**\n\n`
          conv.examples.forEach(ex => {
            markdown += `- ${ex.isCorrect ? '✓' : '✗'} \`${ex.value}\` - ${ex.explanation}\n`
          })
          markdown += '\n'
        }
        
        markdown += '---\n\n'
      })
    })
    
    return markdown
  }

  /**
   * Import from CSV format
   */
  private importFromCSV(data: string): NamingConvention[] {
    const lines = data.split('\n')
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim())
      const obj: any = {}
      
      headers.forEach((header, index) => {
        obj[header.toLowerCase().replace(/\s+/g, '_')] = values[index]
      })
      
      return {
        id: obj.id,
        category: obj.category as NamingCategory,
        component: obj.component,
        field: obj.field,
        pattern: obj.pattern,
        description: obj.description,
        guidelines: '',
        examples: [],
        validationRules: [],
        maxLength: obj.max_length ? parseInt(obj.max_length) : undefined,
        minLength: obj.min_length ? parseInt(obj.min_length) : undefined,
        reservedWords: [],
        caseSensitive: obj.case_sensitive === 'true',
        allowSpaces: obj.allow_spaces === 'true',
        status: obj.status as 'active' | 'draft' | 'archived',
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'import',
        tags: obj.tags ? obj.tags.split(';') : []
      } as NamingConvention
    })
  }

  /**
   * Import from Markdown format
   */
  private importFromMarkdown(data: string): NamingConvention[] {
    // Basic markdown parsing - can be enhanced
    const conventions: NamingConvention[] = []
    // Implementation would parse markdown structure
    // This is a placeholder for the actual implementation
    return conventions
  }
}

// Export singleton instance
export const namingConventionsService = new NamingConventionsService()

