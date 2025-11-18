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
      <div className="mb-6 p-5 bg-ivory-dark/40 dark:bg-charcoal/20 rounded-lg border-l-4 border-champagne/40">
        <p className="font-body text-base leading-relaxed text-charcoal dark:text-[#E8E6E0]">
          Perfect timing. The library’s open, tea’s hot. I've been hoping someone would ask me about something interesting. What have you got?
        </p>
      </div>

      <label htmlFor="topic" className="block text-base font-serif font-semibold text-navy dark:text-[#5B89B3] mb-4">
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
            className="w-full px-6 py-4 border-[0.5px] border-champagne/40 dark:border-champagne/50 rounded-lg focus:ring-4 focus:ring-navy/20 focus:border-navy dark:focus:border-[#5B89B3] outline-none transition-all duration-300 bg-ivory-dark/50 dark:bg-charcoal/30 font-body text-charcoal dark:text-[#E8E6E0] placeholder-charcoal-light/50 dark:placeholder-[#E8E6E0]/40 shadow-inner"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-8 py-4 bg-gradient-to-r from-navy to-navy-deep hover:from-navy-deep hover:to-navy text-pearl rounded-lg font-serif font-semibold disabled:bg-charcoal-light/30 dark:disabled:bg-charcoal-light/20 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-[0.5px] border-champagne/30"
        >
          <MagnifyingGlass size={20} weight="bold" className={loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
          <span>{loading ? 'Contemplating…' : 'Explore'}</span>
        </button>
      </div>
    </form>
  )
}
