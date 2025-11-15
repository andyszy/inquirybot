import { MagnifyingGlass } from '@phosphor-icons/react'

interface SearchFormProps {
  topic: string
  loading: boolean
  onTopicChange: (topic: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SearchForm({ topic, loading, onTopicChange, onSubmit }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        What topic would you like to explore?
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g., quantum computing, ancient Rome, climate change..."
            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 group-hover:border-gray-300 dark:group-hover:border-gray-600"
            disabled={loading}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-emerald-500/0 group-focus-within:from-blue-500/10 group-focus-within:via-cyan-500/10 group-focus-within:to-emerald-500/10 rounded-2xl pointer-events-none transition-all duration-500" />
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-2xl font-semibold disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
        >
          <MagnifyingGlass size={20} weight="bold" className={loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
          <span>{loading ? 'Thinking...' : 'Explore'}</span>
        </button>
      </div>
    </form>
  )
}
