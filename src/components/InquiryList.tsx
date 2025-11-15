interface InquiryListProps {
  topic: string
  inquiries: string[]
  onQuestionClick?: (question: string) => void
}

export function InquiryList({ topic, inquiries, onQuestionClick }: InquiryListProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-decorative italic text-burgundy dark:text-[#C85A6E]">
          Inquiries on{' '}
          <span className="font-bold not-italic">{topic}</span>
        </h2>
        <span className="px-4 py-2 bg-gradient-to-r from-gold/20 to-forest/20 dark:from-gold/30 dark:to-forest/30 text-ink dark:text-[#E8DCC8] rounded-full text-sm font-serif font-semibold border border-gold/30">
          {inquiries.length} {inquiries.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      <ul className="space-y-4">
        {inquiries.map((inquiry, index) => (
          <li key={index} className="animate-gentle-fade" style={{ animationDelay: `${index * 60}ms` }}>
            <button
              onClick={() => onQuestionClick?.(inquiry)}
              className="w-full flex items-start gap-5 p-6 rounded-lg bg-cream/80 dark:bg-ink/30 backdrop-blur-sm border-l-4 border-burgundy/40 dark:border-[#C85A6E]/40 hover:border-burgundy dark:hover:border-[#C85A6E] hover:shadow-xl transition-all duration-300 text-left group relative overflow-hidden"
            >
              {/* Decorative corner */}
              <div className="absolute top-2 right-2 text-gold/20 dark:text-gold/30 group-hover:text-gold/40 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 0 L16 0 L16 16 Z" />
                </svg>
              </div>

              <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-burgundy to-burgundy-deep text-cream rounded-full flex items-center justify-center text-base font-serif font-bold shadow-md group-hover:scale-110 transition-transform border-2 border-gold/40">
                {index + 1}
              </span>
              <span className="flex-1 font-body text-lg text-ink dark:text-[#E8DCC8] leading-relaxed pt-1.5 group-hover:text-burgundy dark:group-hover:text-[#C85A6E] transition-colors">
                {inquiry}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
