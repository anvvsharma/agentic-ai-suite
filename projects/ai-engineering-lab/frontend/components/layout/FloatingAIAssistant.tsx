'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react'

export default function FloatingAIAssistant() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  
  // Determine context based on current page
  const getContextualGreeting = () => {
    if (pathname?.includes('code-forge') || pathname?.includes('standards-rules')) {
      return 'Hi! I\'m your AI assistant. How can I help you with code review and quality standards today?'
    } else if (pathname?.includes('smart-path-finder')) {
      return 'Hi! I\'m your AI assistant. How can I help you with smart path finding today?'
    } else if (pathname?.includes('tdd-generator')) {
      return 'Hi! I\'m your AI assistant. How can I help you with test generation today?'
    } else if (pathname?.includes('integration-analyzer')) {
      return 'Hi! I\'m your AI assistant. How can I help you with integration analysis today?'
    }
    return 'Hi! I\'m your AI assistant. How can I help you today?'
  }

  const getContextualResponse = () => {
    if (pathname?.includes('code-forge') || pathname?.includes('standards-rules')) {
      return 'I understand your question. Let me analyze the code quality and standards...'
    } else if (pathname?.includes('smart-path-finder')) {
      return 'I understand your question. Let me analyze the current path finding data...'
    } else if (pathname?.includes('tdd-generator')) {
      return 'I understand your question. Let me help you generate comprehensive tests...'
    } else if (pathname?.includes('integration-analyzer')) {
      return 'I understand your question. Let me analyze the integration patterns...'
    }
    return 'I understand your question. Let me help you with that...'
  }

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: getContextualGreeting()
    }
  ])

  // Reset messages when pathname changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: getContextualGreeting()
      }
    ])
  }, [pathname])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, { role: 'user', content: message }])
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: getContextualResponse()
      }])
    }, 1000)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-6 right-6 w-14 h-14 rounded-full
          bg-gradient-to-br from-purple-600 to-blue-600
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300 hover:scale-110
          flex items-center justify-center z-50
          group
        "
        title="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </button>
    )
  }

  return (
    <div
      className={`
        fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50
        transition-all duration-300 border border-gray-200
        ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-white/80">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded hover:bg-white/20 transition-colors"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="overflow-y-auto p-4 space-y-4" style={{ height: 'calc(600px - 240px)' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pathname?.includes('code-forge') || pathname?.includes('standards-rules') ? (
                <>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Review code
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Check standards
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Export report
                  </button>
                </>
              ) : pathname?.includes('smart-path-finder') ? (
                <>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Analyze routes
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Optimize stops
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Export data
                  </button>
                </>
              ) : (
                <>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Get help
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    View docs
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Ask question
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="
                  flex-1 px-4 py-2.5 rounded-xl border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  text-sm
                "
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="
                  px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600
                  text-white font-medium hover:opacity-90 transition-opacity
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center
                "
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

