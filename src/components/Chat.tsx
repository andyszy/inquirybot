import { useState, useRef, useEffect } from 'react'
import { PaperPlaneRight, User, GraduationCap } from '@phosphor-icons/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '../hooks/useChat.ts'

interface ChatProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
}

export function Chat({ messages, isLoading, onSendMessage }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mb-4 animate-float">
              <GraduationCap size={32} weight="fill" className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Let's Explore Together
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              I'm here to guide you through discovery. Share your thoughts, and let's uncover the answers together through dialogue.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <GraduationCap size={20} weight="fill" className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                      : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Customize rendering of specific elements
                          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-blue-700 dark:text-blue-300">{children}</strong>,
                          em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
                          code: ({ className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                              <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto my-3">
                                <code className={`text-sm ${className}`} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            )
                          },
                          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-cyan-500 dark:border-cyan-400 pl-4 py-2 my-3 italic bg-cyan-50/50 dark:bg-cyan-900/20 rounded-r">
                              {children}
                            </blockquote>
                          ),
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
                          hr: () => <hr className="my-4 border-gray-300 dark:border-gray-600" />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User size={20} weight="fill" className="text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start animate-slide-up">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <GraduationCap size={20} weight="fill" className="text-white" />
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-600 dark:bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={isLoading}
            className="flex-1 px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-300 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-2xl font-semibold disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </form>
      </div>
    </div>
  )
}
