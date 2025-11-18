import { useState, useCallback, useRef, useEffect } from 'react'
import Anthropic from '@anthropic-ai/sdk'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
}

interface UseChatOptions {
  sessionId?: string
  topic?: string
  questions?: string[]
  selectedQuestion?: string
  onSessionCreated?: (sessionId: string) => void
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(options.sessionId ? [] : [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(options.sessionId)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  
  // Use ref for callbacks to avoid dependency cycles
  const optionsRef = useRef(options)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Update ref when options change
  useEffect(() => {
    optionsRef.current = options
  }, [options.topic, options.questions, options.selectedQuestion, options.onSessionCreated])

  const saveSession = useCallback(async (sessionId: string | undefined, newMessages: Message[]) => {
    const currentOptions = optionsRef.current
    if (!currentOptions.topic || !currentOptions.questions || !currentOptions.selectedQuestion) return

    try {
      console.log('Saving session...', { sessionId, messageCount: newMessages.length })
      
      // Try relative path first (standard), but fallback to localhost:3000 if that fails (for dev resilience)
      let url = '/api/chat/save';
      let response;
      
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: sessionId,
            topic: currentOptions.topic,
            questions: currentOptions.questions,
            selectedQuestion: currentOptions.selectedQuestion,
            messages: newMessages,
          }),
        });
      } catch (e) {
        // If relative path failed (network error) and we are on localhost, try explicit port 3000
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.warn('Relative API path failed, retrying with http://localhost:3000...');
          url = 'http://localhost:3000/api/chat/save';
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: sessionId,
              topic: currentOptions.topic,
              questions: currentOptions.questions,
              selectedQuestion: currentOptions.selectedQuestion,
              messages: newMessages,
            }),
          });
        } else {
          throw e;
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`Failed to save session: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('Session saved:', data)
      
      if (!sessionId && data.id) {
        setCurrentSessionId(data.id)
        if (currentOptions.onSessionCreated) {
          console.log('Calling onSessionCreated with:', data.id)
          currentOptions.onSessionCreated(data.id)
        }
      }
    } catch (err) {
      console.error('Error saving session:', err)
      // Don't show error to user for save failures, but log it
    }
  }, []) // No dependencies needed thanks to ref

  const sendMessage = async (content: string, selectedQuestion?: string) => {
    if (!content.trim() && !selectedQuestion) return

    // Cancel any ongoing streaming
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selectedQuestion || content,
      timestamp: Date.now()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)
    setError(null)

    // Create a new assistant message that will be populated as we stream
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    }

    // Add the empty assistant message to the UI
    setMessages([...updatedMessages, assistantMessage])
    setStreamingMessageId(assistantMessageId)

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

      if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error('Please set your Anthropic API key in the .env file')
      }

      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true
      })

      const systemPrompt = `You are a world-class educator deeply trained in progressive education and inquiry-based learning methods. Your goal is to guide students to discover insights themselves rather than simply providing answers.

## Core Principles

1. **Treat student questions as genuine intellectual curiosity** - Never dismiss or oversimplify. Every question reveals sophisticated observation.

2. **Guide discovery through questions** - Your primary tool is the Socratic method. Ask questions that help students build understanding step by step.

3. **Validate observations first** - Acknowledge what the student has noticed before exploring deeper.

4. **Build from concrete to abstract** - Start with tangible, observable details before moving to concepts, principles, or theories.

5. **Reveal hidden complexity** - Show that "obvious" answers often mask deeper tradeoffs, coordination problems, or optimization constraints.

## Your Response Structure

### Opening (1-2 sentences)
- Validate their observation
- Express genuine curiosity about their thinking
- Reframe if needed to sharpen the question

### First Question (The Foundation)
Ask about the concrete, observable details they might not have considered.

### Key Techniques

- **Reveal Assumptions**: Help students notice their hidden assumptions
- **Introduce Constraints**: Add real-world constraints they haven't considered
- **Flip Perspectives**: Encourage them to see from different viewpoints
- **Use Estimation**: Build quantitative intuition
- **Connect to Broader Patterns**: Help them see this isn't isolated

## What to Avoid

- ❌ Lecturing or info-dumping
- ❌ Giving the answer directly
- ❌ Using jargon before they've discovered the concept
- ❌ Asking too many questions at once (max 1-2 at a time)
- ❌ Moving to abstraction before building concrete understanding

## Your Tone

- Genuinely curious and excited about their thinking
- Collaborative, not authoritative ("Let's explore..." not "Let me teach you...")
- Patient with productive struggle
- Celebratory when they make connections
- Natural and conversational

## Formatting

**IMPORTANT**: Format all responses using Markdown. Use bold for emphasis, bullet lists, blockquotes for student observations, inline code for technical terms, and code blocks when appropriate.

Remember: The best learning happens when students surprise themselves with their own insights. Your job is to ask the questions that make those insights inevitable.`

      // Build conversation history for API
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: selectedQuestion || content
      })

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      // Use streaming API
      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-5',
        max_tokens: 2048,
        system: systemPrompt,
        messages: apiMessages as any
      })

      let fullContent = ''

      // Handle streaming events
      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            fullContent += event.delta.text
            
            // Update the streaming message
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === assistantMessageId
                  ? { ...msg, content: fullContent }
                  : msg
              )
            )
          }
        }
      }

      // Mark streaming as complete
      setStreamingMessageId(null)
      
      // Update messages with final non-streaming state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      )

      // Build final messages array for saving
      const finalMessages = [...updatedMessages, {
        ...assistantMessage,
        content: fullContent,
        isStreaming: false
      }]

      // Auto-save session after receiving complete assistant response
      await saveSession(currentSessionId, finalMessages)
    } catch (err) {
      // Remove the streaming message if there was an error
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== assistantMessageId)
      )
      setStreamingMessageId(null)
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
    setCurrentSessionId(undefined)
  }

  const loadMessages = (loadedMessages: Message[]) => {
    setMessages(loadedMessages)
  }

  return {
    messages,
    isLoading,
    error,
    sessionId: currentSessionId,
    streamingMessageId,
    sendMessage,
    clearChat,
    loadMessages
  }
}
