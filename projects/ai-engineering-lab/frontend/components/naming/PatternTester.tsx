'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { validationEngine } from '@/lib/validation-engine'
import { ValidationResult } from '@/lib/naming-types'

interface PatternTesterProps {
  pattern: string
  maxLength?: number
  minLength?: number
  reservedWords?: string[]
  caseSensitive?: boolean
  allowSpaces?: boolean
  onValidationChange?: (result: ValidationResult) => void
}

export default function PatternTester({
  pattern,
  maxLength,
  minLength,
  reservedWords = [],
  caseSensitive = true,
  allowSpaces = false,
  onValidationChange
}: PatternTesterProps) {
  const [testValue, setTestValue] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (testValue) {
      setIsValidating(true)
      const timer = setTimeout(() => {
        const result = validationEngine.validatePattern(pattern, testValue, {
          maxLength,
          minLength,
          reservedWords,
          caseSensitive,
          allowSpaces
        })
        setValidationResult(result)
        setIsValidating(false)
        onValidationChange?.(result)
      }, 300) // Debounce validation

      return () => clearTimeout(timer)
    } else {
      setValidationResult(null)
      setIsValidating(false)
    }
  }, [testValue, pattern, maxLength, minLength, reservedWords, caseSensitive, allowSpaces, onValidationChange])

  const handleClear = () => {
    setTestValue('')
    setValidationResult(null)
  }

  const handleUseExample = () => {
    const example = validationEngine.generateExampleFromPattern(pattern)
    setTestValue(example)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
            🧪
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pattern Tester</h3>
            <p className="text-sm text-gray-500">Test your naming convention in real-time</p>
          </div>
        </div>
        <button
          onClick={handleUseExample}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Use Example
        </button>
      </div>

      {/* Pattern Display */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Pattern
        </label>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 shadow-inner">
          <code className="text-sm font-mono text-green-400">{pattern}</code>
        </div>
      </div>

      {/* Input Field */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Test Value
        </label>
        <div className="relative">
          <input
            type="text"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            placeholder="Enter a value to test..."
            className={`
              w-full px-4 py-3 text-sm border-2 rounded-lg transition-all
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${validationResult
                ? validationResult.isValid
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
                  : 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
              }
            `}
          />
          {testValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {testValue && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>Length: {testValue.length}</span>
            {maxLength && <span>/ {maxLength} max</span>}
          </div>
        )}
      </div>

      {/* Validation Status */}
      <AnimatePresence mode="wait">
        {isValidating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-4"
          >
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span>Validating...</span>
          </motion.div>
        )}

        {!isValidating && validationResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Validation Result Badge */}
            <div className={`
              flex items-center gap-2 px-4 py-3 rounded-lg mb-4
              ${validationResult.isValid
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
              }
            `}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-lg
                ${validationResult.isValid
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                }
              `}>
                {validationResult.isValid ? '✓' : '✗'}
              </div>
              <div className="flex-1">
                <p className={`
                  text-sm font-semibold
                  ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}
                `}>
                  {validationResult.isValid ? 'Valid Pattern Match' : 'Pattern Mismatch'}
                </p>
                <p className={`
                  text-xs
                  ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}
                `}>
                  {validationResult.isValid
                    ? 'The value matches the naming convention'
                    : `${validationResult.errors.length} error(s) found`
                  }
                </p>
              </div>
            </div>

            {/* Pattern Breakdown */}
            {validationResult.breakdown && validationResult.breakdown.components.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Pattern Breakdown
                </h4>
                <div className="space-y-2">
                  {validationResult.breakdown.components.map((component, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border
                        ${component.isValid
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${component.isValid
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                        }
                      `}>
                        {component.isValid ? '✓' : '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">{component.name}</span>
                          {component.value && (
                            <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono text-gray-800">
                              {component.value}
                            </code>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{component.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-3">
                  Errors ({validationResult.errors.length})
                </h4>
                <div className="space-y-2">
                  {validationResult.errors.map((error, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        !
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{error.message}</p>
                        {error.suggestion && (
                          <p className="text-xs text-red-600 mt-1">
                            💡 Suggestion: {error.suggestion}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-3">
                  Warnings ({validationResult.warnings.length})
                </h4>
                <div className="space-y-2">
                  {validationResult.warnings.map((warning, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        ⚠
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">{warning.message}</p>
                        {warning.suggestion && (
                          <p className="text-xs text-yellow-600 mt-1">
                            💡 Suggestion: {warning.suggestion}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {validationResult.suggestions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
                  Suggestions
                </h4>
                <div className="space-y-2">
                  {validationResult.suggestions.map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="text-blue-500 text-lg flex-shrink-0">💡</div>
                      <p className="text-sm text-blue-800">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!testValue && !isValidating && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm text-gray-600 font-medium">Enter a value to test</p>
          <p className="text-xs text-gray-500 mt-1">See real-time validation results</p>
        </div>
      )}
    </div>
  )
}

