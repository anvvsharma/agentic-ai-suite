/**
 * Validation Engine for Naming Conventions
 * Provides pattern matching, validation, and rule checking
 */

import { ValidationResult, ValidationError, ValidationWarning, PatternBreakdown } from './naming-types'

export interface PatternComponent {
  name: string
  value: string
  isValid: boolean
  description: string
  isOptional?: boolean
}

export class ValidationEngine {
  /**
   * Validate a value against a naming pattern
   */
  validatePattern(
    pattern: string,
    value: string,
    options: {
      maxLength?: number
      minLength?: number
      reservedWords?: string[]
      caseSensitive?: boolean
      allowSpaces?: boolean
    } = {}
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const suggestions: string[] = []

    // Length validation
    if (options.maxLength && value.length > options.maxLength) {
      errors.push({
        rule: 'max_length',
        message: `Value exceeds maximum length of ${options.maxLength} characters`,
        suggestion: value.substring(0, options.maxLength)
      })
    }

    if (options.minLength && value.length < options.minLength) {
      errors.push({
        rule: 'min_length',
        message: `Value is shorter than minimum length of ${options.minLength} characters`,
      })
    }

    // Reserved words check
    if (options.reservedWords && options.reservedWords.length > 0) {
      const reservedCheck = this.checkReservedWords(value, options.reservedWords, options.caseSensitive)
      if (!reservedCheck.isValid) {
        errors.push({
          rule: 'reserved_words',
          message: `Value contains reserved word: ${reservedCheck.word}`,
          suggestion: `Avoid using reserved words like ${reservedCheck.word}`
        })
      }
    }

    // Space validation
    if (!options.allowSpaces && value.includes(' ')) {
      errors.push({
        rule: 'no_spaces',
        message: 'Spaces are not allowed in this field',
        suggestion: value.replace(/\s+/g, '_')
      })
    }

    // Pattern matching
    const patternResult = this.matchPattern(pattern, value)
    if (!patternResult.isValid) {
      errors.push(...patternResult.errors)
      warnings.push(...patternResult.warnings)
    }

    // Generate suggestions
    if (errors.length > 0) {
      suggestions.push(...this.generateSuggestions(pattern, value, errors))
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      breakdown: patternResult.breakdown
    }
  }

  /**
   * Match a value against a pattern and break it down
   */
  private matchPattern(pattern: string, value: string): {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
    breakdown?: PatternBreakdown
  } {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const components: PatternComponent[] = []

    // Extract pattern components (e.g., <ORG>, <SRC>, <TGT>)
    const patternRegex = /<([^>]+)>/g
    const patternComponents: string[] = []
    let match

    while ((match = patternRegex.exec(pattern)) !== null) {
      patternComponents.push(match[1])
    }

    // Convert pattern to regex
    let regexPattern = pattern
      .replace(/</g, '(?<')
      .replace(/>/g, '>[A-Z0-9_]+)')
      .replace(/\|/g, '|')

    // Handle optional components
    regexPattern = regexPattern.replace(/\[([^\]]+)\]/g, '($1)?')

    try {
      const regex = new RegExp(`^${regexPattern}$`)
      const regexMatch = regex.exec(value)

      if (!regexMatch) {
        errors.push({
          rule: 'pattern_mismatch',
          message: `Value does not match the expected pattern: ${pattern}`,
          suggestion: `Expected format: ${pattern}`
        })
        return { isValid: false, errors, warnings }
      }

      // Extract matched groups
      const groups = regexMatch.groups || {}
      
      // Build breakdown
      patternComponents.forEach((componentName) => {
        const componentValue = groups[componentName] || ''
        components.push({
          name: componentName,
          value: componentValue,
          isValid: componentValue.length > 0,
          description: this.getComponentDescription(componentName)
        })
      })

      // Validate individual components
      components.forEach((component) => {
        if (!component.isValid && !component.isOptional) {
          errors.push({
            rule: 'missing_component',
            message: `Missing required component: ${component.name}`,
            suggestion: `Add ${component.description}`
          })
        }
      })

    } catch (error) {
      errors.push({
        rule: 'invalid_pattern',
        message: 'Invalid pattern format',
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      breakdown: { components }
    }
  }

  /**
   * Check if value contains reserved words
   */
  checkReservedWords(
    value: string,
    reservedWords: string[],
    caseSensitive: boolean = false
  ): { isValid: boolean; word?: string } {
    const checkValue = caseSensitive ? value : value.toLowerCase()
    
    for (const word of reservedWords) {
      const checkWord = caseSensitive ? word : word.toLowerCase()
      
      // Check for exact match or pattern match (e.g., *-BA-*, *-TA-*)
      if (checkWord.includes('*')) {
        const pattern = checkWord.replace(/\*/g, '.*')
        const regex = new RegExp(pattern, caseSensitive ? '' : 'i')
        if (regex.test(checkValue)) {
          return { isValid: false, word }
        }
      } else if (checkValue.includes(checkWord)) {
        return { isValid: false, word }
      }
    }
    
    return { isValid: true }
  }

  /**
   * Validate length constraints
   */
  validateLength(value: string, min?: number, max?: number): boolean {
    if (min !== undefined && value.length < min) return false
    if (max !== undefined && value.length > max) return false
    return true
  }

  /**
   * Parse pattern into components
   */
  parsePattern(pattern: string): PatternComponent[] {
    const components: PatternComponent[] = []
    const regex = /<([^>]+)>/g
    let match

    while ((match = regex.exec(pattern)) !== null) {
      const componentName = match[1]
      components.push({
        name: componentName,
        value: '',
        isValid: false,
        description: this.getComponentDescription(componentName),
        isOptional: pattern.includes(`[<${componentName}>]`)
      })
    }

    return components
  }

  /**
   * Get description for a pattern component
   */
  private getComponentDescription(componentName: string): string {
    const descriptions: Record<string, string> = {
      'ORG': 'Organization code (3-4 characters)',
      'SRC': 'Source system name',
      'TGT': 'Target system name',
      'OBJ': 'Business object or data type',
      'TYPE': 'Integration type (INT, SCH, SUB, RT)',
      'RICE_ID': 'RICE ID for tracking',
      'SYSTEM': 'System name',
      'ADAPTER': 'Adapter type (REST, SOAP, FTP, DB, FILE)',
      'DOMAIN': 'Business domain',
      'SUBDOMAIN': 'Business subdomain',
      'MAJOR': 'Major version number',
      'MINOR': 'Minor version number',
      'PATCH': 'Patch version number',
      'PURPOSE': 'Purpose or functionality description',
      'MODULE': 'Module name',
      'FUNCTIONALITY': 'Functionality description'
    }

    return descriptions[componentName] || `${componentName} component`
  }

  /**
   * Generate suggestions based on errors
   */
  private generateSuggestions(pattern: string, value: string, errors: ValidationError[]): string[] {
    const suggestions: string[] = []

    // If pattern mismatch, suggest the pattern format
    if (errors.some(e => e.rule === 'pattern_mismatch')) {
      suggestions.push(`Follow the pattern: ${pattern}`)
      
      // Extract example from pattern
      const example = this.generateExampleFromPattern(pattern)
      if (example) {
        suggestions.push(`Example: ${example}`)
      }
    }

    // If length issues, suggest trimming or padding
    if (errors.some(e => e.rule === 'max_length')) {
      suggestions.push('Consider using abbreviations to reduce length')
    }

    if (errors.some(e => e.rule === 'min_length')) {
      suggestions.push('Add more descriptive information')
    }

    return suggestions
  }

  /**
   * Generate an example value from a pattern
   */
  generateExampleFromPattern(pattern: string): string {
    const examples: Record<string, string> = {
      '<ORG>': 'BCRX',
      '<SRC>': '3PL',
      '<TGT>': 'ERP',
      '<OBJ>': 'TRANSACTIONS',
      '<TYPE>': 'INT',
      '<RICE_ID>': 'INT001',
      '<SYSTEM>': 'SALESFORCE',
      '<ADAPTER>': 'REST',
      '<DOMAIN>': 'SUPPLY_CHAIN',
      '<SUBDOMAIN>': 'LOGISTICS',
      '<MAJOR>': '01',
      '<MINOR>': '00',
      '<PATCH>': '0000',
      '<PURPOSE>': 'DATETIME_FORMATTER',
      '<MODULE>': 'SCM',
      '<FUNCTIONALITY>': 'IMPORT'
    }

    let example = pattern
    Object.entries(examples).forEach(([key, value]) => {
      example = example.replace(new RegExp(key, 'g'), value)
    })

    // Remove optional brackets
    example = example.replace(/\[|\]/g, '')
    
    return example
  }

  /**
   * Validate version format
   */
  validateVersion(version: string): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    // Version format: xx.xx.xxxx
    const versionRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/
    const match = versionRegex.exec(version)

    if (!match) {
      errors.push({
        rule: 'invalid_version_format',
        message: 'Version must be in format: xx.xx.xxxx (e.g., 01.00.0000)',
        suggestion: '01.00.0000'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions: []
    }
  }

  /**
   * Validate identifier format
   */
  validateIdentifier(identifier: string, maxLength: number = 32): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Must start with letter
    if (!/^[A-Z]/i.test(identifier)) {
      errors.push({
        rule: 'invalid_start',
        message: 'Identifier must start with a letter (A-Z)',
      })
    }

    // Only letters, numbers, underscore, dash
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(identifier)) {
      errors.push({
        rule: 'invalid_characters',
        message: 'Identifier can only contain letters, numbers, underscores, and dashes',
      })
    }

    // Length check
    if (identifier.length > maxLength) {
      errors.push({
        rule: 'max_length',
        message: `Identifier cannot be longer than ${maxLength} characters`,
      })
    }

    // Check for reserved patterns
    const reservedPatterns = ['-(BA|XBA|TA|R)-', '\\.(ba|xba|ta|r)\\.']
    reservedPatterns.forEach(pattern => {
      if (new RegExp(pattern, 'i').test(identifier)) {
        errors.push({
          rule: 'reserved_pattern',
          message: 'Identifier contains reserved pattern (BA/XBA/TA/R)',
        })
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions: []
    }
  }
}

// Export singleton instance
export const validationEngine = new ValidationEngine()

