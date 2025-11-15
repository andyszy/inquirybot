import { useMemo } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface SearchFormProps {
  topic: string
  loading: boolean
  onTopicChange: (topic: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const TOPIC_EXAMPLES = [
  'ancient Rome',
  'plane crashes',
  'pillows',
  'elephants',
  'lighthouses',
  'typewriters',
  'honey bees',
  'submarines',
  'glaciers',
  'origami',
  'operas',
  'mushrooms',
  'sundials',
  'calligraphy'
]

export function SearchForm({ topic, loading, onTopicChange, onSubmit }: SearchFormProps) {
  const placeholderText = useMemo(() => {
    const shuffled = [...TOPIC_EXAMPLES].sort(() => Math.random() - 0.5)
    return `e.g., ${shuffled[0]}, ${shuffled[1]}…`
  }, [])

  return (
    <form onSubmit={onSubmit} className="mb-8">
      {/* Welcome message */}
      <div className="mb-6 p-5 bg-parchment-dark/40 dark:bg-ink/20 rounded-lg border-l-4 border-gold/40">
        <p className="font-body text-base leading-relaxed text-ink dark:text-[#E8DCC8]">
          Perfect timing. The library’s open, tea’s hot. I've been hoping someone would ask me about something interesting. What have you got?
        </p>
      </div>

      <label htmlFor="topic" className="block text-base font-serif font-semibold text-burgundy dark:text-[#C85A6E] mb-4">
        What should we discuss this evening?
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder={placeholderText}
            className="w-full px-6 py-4 border-2 border-gold/40 dark:border-gold/50 rounded-lg focus:ring-4 focus:ring-burgundy/20 focus:border-burgundy dark:focus:border-[#C85A6E] outline-none transition-all duration-300 bg-parchment-dark/50 dark:bg-ink/30 font-body text-ink dark:text-[#E8DCC8] placeholder-ink-light/50 dark:placeholder-[#E8DCC8]/40 shadow-inner"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-8 py-4 bg-gradient-to-r from-burgundy to-burgundy-deep hover:from-burgundy-deep hover:to-burgundy text-cream rounded-lg font-serif font-semibold disabled:bg-ink-light/30 dark:disabled:bg-ink-light/20 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gold/30"
        >
          <MagnifyingGlass size={20} weight="bold" className={loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
          <span>{loading ? 'Contemplating…' : 'Explore'}</span>
        </button>
      </div>
    </form>
  )
}
