import { useState } from 'react'
import { MagnifyingGlass, Sparkle } from '@phosphor-icons/react'
import Anthropic from '@anthropic-ai/sdk'

function App() {
  const [topic, setTopic] = useState('')
  const [inquiries, setInquiries] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInquiries = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setError(null)
    setInquiries([])

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

      if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error('Please set your Anthropic API key in the .env file')
      }

      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true
      })

      const prompt = `You are an aristocratic tutor

For each topic the student specifies output a list of potential inquiries. Prioritize interestingness and intellectual depth over comprehensiveness. Good: unsolved problems, moral dilemmas, awkward questions. Bad: restating the question, topics with simple answers, "trivia" or memorization questions.

Example topic: plane crashes
Example answer
- why do jet engines stall
- why do we need the aviation alphabet
- why do airports use trained falcons
- why does etops exist
- why do first class customers board first
- why did the Concorde fail
- why don't we have flying cars yet
- why do we have electric cars but not electric planes

Topic: ${topic}`

      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      // Extract text from response
      const responseText = message.content
        .filter(block => block.type === 'text')
        .map(block => 'text' in block ? block.text : '')
        .join('')

      // Parse the response into individual inquiries
      const inquiryList = responseText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())

      setInquiries(inquiryList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error generating inquiries:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateInquiries()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Sparkle size={32} weight="fill" className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">InquiryBot</h1>
          <p className="text-gray-600">Your Aristocratic Tutor for Intellectual Exploration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              What topic would you like to explore?
            </label>
            <div className="flex gap-3">
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., quantum computing, ancient Rome, climate change..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <MagnifyingGlass size={20} weight="bold" />
                {loading ? 'Thinking...' : 'Explore'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {!loading && inquiries.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Intriguing Inquiries about "{topic}"
              </h2>
              <ul className="space-y-2">
                {inquiries.map((inquiry, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{inquiry}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Powered by Claude 3.5 Sonnet</p>
        </div>
      </div>
    </div>
  )
}

export default App
