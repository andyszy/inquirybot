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
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-navy to-navy-deep rounded-full flex items-center justify-center mb-6 animate-float border-[0.5px] border-champagne/30 shadow-lg">
              <GraduationCap size={36} weight="fill" className="text-champagne" />
            </div>
            <h3 className="text-2xl font-decorative italic text-navy dark:text-[#5B89B3] mb-3">
              Let us explore together…
            </h3>
            <p className="font-body text-charcoal-light dark:text-[#E8E6E0]/70 max-w-md leading-relaxed">
              Share your thoughts and curiosities. Through dialogue, we shall uncover insights and deepen understanding.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-gentle-fade`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-navy to-navy-deep rounded-full flex items-center justify-center border-[0.5px] border-champagne/40 shadow-md">
                    <GraduationCap size={22} weight="fill" className="text-champagne" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-xl px-6 py-5 relative ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-emerald to-emerald-deep text-pearl border-[0.5px] border-champagne/30 shadow-lg'
                      : 'bg-ivory-dark/60 dark:bg-charcoal/40 backdrop-blur-sm border-[0.5px] border-navy/20 dark:border-[#5B89B3]/20 text-charcoal dark:text-[#E8E6E0] shadow-md'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="font-body text-base leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-navy dark:prose-invert max-w-none font-body">
                      {message.isStreaming && !message.content && (
                        <div className="py-2">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-navy dark:border-[#5B89B3] border-t-transparent"></div>
                        </div>
                      )}
                      {message.content && <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-base">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-navy dark:text-[#5B89B3]">{children}</strong>,
                          em: ({ children }) => <em className="font-decorative text-charcoal dark:text-[#E8E6E0]">{children}</em>,
                          code: ({ className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                              <pre className="bg-charcoal/10 dark:bg-charcoal/30 rounded-lg p-4 overflow-x-auto my-3 border border-navy/20">
                                <code className={`text-sm font-mono ${className}`} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-navy/10 dark:bg-navy/20 text-navy-deep dark:text-[#5B89B3] px-2 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            )
                          },
                          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1.5">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-emerald dark:border-[#4A9D7B] pl-4 py-2 my-4 italic bg-champagne/10 dark:bg-champagne/20 rounded-r">
                              {children}
                            </blockquote>
                          ),
                          h1: ({ children }) => <h1 className="text-xl font-serif font-bold mb-3 mt-4 first:mt-0 text-navy dark:text-[#5B89B3]">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-serif font-bold mb-2 mt-3 first:mt-0 text-navy dark:text-[#5B89B3]">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-serif font-bold mb-2 mt-3 first:mt-0 text-navy dark:text-[#5B89B3]">{children}</h3>,
                          hr: () => <hr className="my-4 border-champagne/30" />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>}
                      {message.isStreaming && message.content && (
                        <span className="inline-block w-2 h-4 bg-navy dark:bg-[#5B89B3] animate-pulse ml-1"></span>
                      )}
                    </div>
                  )}
                  <span className={`text-xs mt-3 block font-serif ${
                    message.role === 'user' ? 'text-pearl/70' : 'text-charcoal-light/50 dark:text-[#E8E6E0]/40'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-12 h-12 bg-charcoal-light dark:bg-[#E8E6E0]/20 rounded-full flex items-center justify-center border-[0.5px] border-champagne/30 shadow-md">
                    <User size={22} weight="fill" className="text-champagne" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages.length > 0 && !messages[messages.length - 1]?.content && !messages[messages.length - 1]?.isStreaming && (
              <div className="flex gap-4 justify-start animate-gentle-fade">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-navy to-navy-deep rounded-full flex items-center justify-center border-[0.5px] border-champagne/40 shadow-md">
                  <GraduationCap size={22} weight="fill" className="text-champagne" />
                </div>
                <div className="bg-ivory-dark/60 dark:bg-charcoal/40 backdrop-blur-sm border-[0.5px] border-navy/20 dark:border-[#5B89B3]/20 rounded-xl px-6 py-5 shadow-md">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-navy dark:border-[#5B89B3] border-t-transparent"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-[0.5px] border-champagne/30 p-6 bg-ivory/40 dark:bg-charcoal/20 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts…"
            disabled={isLoading}
            className="flex-1 px-5 py-4 border-[0.5px] border-champagne/40 dark:border-champagne/50 rounded-lg focus:ring-4 focus:ring-navy/20 focus:border-navy dark:focus:border-[#5B89B3] outline-none transition-all duration-300 bg-pearl/80 dark:bg-charcoal/30 font-body text-charcoal dark:text-[#E8E6E0] placeholder-charcoal-light/40 dark:placeholder-[#E8E6E0]/30 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 bg-gradient-to-r from-navy to-navy-deep hover:from-navy-deep hover:to-navy text-pearl rounded-lg font-serif font-semibold disabled:bg-charcoal-light/30 dark:disabled:bg-charcoal-light/20 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-[0.5px] border-champagne/30"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </form>
      </div>
    </div>
  )
}
