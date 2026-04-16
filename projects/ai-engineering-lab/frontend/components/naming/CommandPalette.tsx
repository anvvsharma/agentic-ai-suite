'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommandPaletteState, Command } from '@/lib/naming-types'

interface CommandPaletteProps {
  state: CommandPaletteState
  onClose: () => void
  onExecute: (command: Command) => void
}

// Available commands
const availableCommands: Command[] = [
  // Navigation
  {
    id: 'nav-explorer',
    label: 'Toggle Explorer Panel',
    description: 'Show or hide the explorer sidebar',
    shortcut: '⌘/',
    icon: '📁',
    action: () => console.log('Toggle explorer'),
    category: 'navigation',
  },
  {
    id: 'nav-inspector',
    label: 'Toggle Inspector Panel',
    description: 'Show or hide the inspector sidebar',
    shortcut: '⌘B',
    icon: '👁️',
    action: () => console.log('Toggle inspector'),
    category: 'navigation',
  },
  {
    id: 'nav-integrations',
    label: 'Go to Integrations',
    description: 'Navigate to integrations category',
    icon: '🔗',
    action: () => console.log('Go to integrations'),
    category: 'navigation',
  },
  {
    id: 'nav-connections',
    label: 'Go to Connections',
    description: 'Navigate to connections category',
    icon: '🔌',
    action: () => console.log('Go to connections'),
    category: 'navigation',
  },

  // Editing
  {
    id: 'edit-new',
    label: 'New Convention',
    description: 'Create a new naming convention',
    shortcut: '⌘N',
    icon: '➕',
    action: () => console.log('New convention'),
    category: 'editing',
  },
  {
    id: 'edit-duplicate',
    label: 'Duplicate Convention',
    description: 'Duplicate the current convention',
    shortcut: '⌘D',
    icon: '📋',
    action: () => console.log('Duplicate'),
    category: 'editing',
  },
  {
    id: 'edit-save',
    label: 'Save Changes',
    description: 'Save all pending changes',
    shortcut: '⌘S',
    icon: '💾',
    action: () => console.log('Save'),
    category: 'editing',
  },
  {
    id: 'edit-delete',
    label: 'Delete Convention',
    description: 'Delete the current convention',
    shortcut: '⌘⌫',
    icon: '🗑️',
    action: () => console.log('Delete'),
    category: 'editing',
  },

  // View
  {
    id: 'view-pattern',
    label: 'View Pattern',
    description: 'Show pattern definition',
    icon: '📝',
    action: () => console.log('View pattern'),
    category: 'view',
  },
  {
    id: 'view-guidelines',
    label: 'View Guidelines',
    description: 'Show naming guidelines',
    icon: '📖',
    action: () => console.log('View guidelines'),
    category: 'view',
  },
  {
    id: 'view-examples',
    label: 'View Examples',
    description: 'Show usage examples',
    icon: '💡',
    action: () => console.log('View examples'),
    category: 'view',
  },
  {
    id: 'view-validation',
    label: 'View Validation',
    description: 'Show validation rules',
    icon: '✓',
    action: () => console.log('View validation'),
    category: 'view',
  },

  // Help
  {
    id: 'help-shortcuts',
    label: 'Keyboard Shortcuts',
    description: 'View all keyboard shortcuts',
    shortcut: '⌘?',
    icon: '⌨️',
    action: () => console.log('Show shortcuts'),
    category: 'help',
  },
  {
    id: 'help-docs',
    label: 'Documentation',
    description: 'Open documentation',
    icon: '📚',
    action: () => console.log('Open docs'),
    category: 'help',
  },
]

export default function CommandPalette({
  state,
  onClose,
  onExecute,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter commands based on query
  const filteredCommands = query
    ? availableCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(query.toLowerCase())
      )
    : availableCommands

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  // Focus input when opened
  useEffect(() => {
    if (state.isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [state.isOpen])

  // Reset state when closed
  useEffect(() => {
    if (!state.isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [state.isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const command = filteredCommands[selectedIndex]
        if (command) {
          onExecute(command)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, selectedIndex, filteredCommands, onExecute])

  if (!state.isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                placeholder="Search commands or type a command..."
                className="w-full pl-12 pr-4 py-3 text-lg outline-none"
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm text-gray-500">No commands found</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {commands.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command)
                        const isSelected = globalIndex === selectedIndex

                        return (
                          <button
                            key={command.id}
                            onClick={() => onExecute(command)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg
                              transition-all duration-150
                              ${isSelected
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-50'
                              }
                            `}
                          >
                            <span className="text-xl">{command.icon}</span>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">{command.label}</div>
                              {command.description && (
                                <div className="text-xs text-gray-500">{command.description}</div>
                              )}
                            </div>
                            {command.shortcut && (
                              <kbd className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-300">
                                {command.shortcut}
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Esc</kbd>
                  <span>Close</span>
                </span>
              </div>
              <span>{filteredCommands.length} commands</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

