import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (content: string, selectedQuestion?: string) => {
    if (!content.trim() && !selectedQuestion) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selectedQuestion || content,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

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

      const response = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 2048,
        system: systemPrompt,
        messages: apiMessages as any
      })

      const assistantContent = response.content
        .filter(block => block.type === 'text')
        .map(block => 'text' in block ? block.text : '')
        .join('')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  }
}
