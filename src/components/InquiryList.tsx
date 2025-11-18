interface InquiryListProps {
  topic: string
  inquiries: string[]
  onQuestionClick?: (question: string) => void
}

export function InquiryList({ topic, inquiries, onQuestionClick }: InquiryListProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-decorative italic text-navy dark:text-[#5B89B3]">
          Inquiries on{' '}
          <span className="font-bold not-italic">{topic}</span>
        </h2>
        <span className="px-4 py-2 bg-champagne/20 dark:bg-champagne/30 text-charcoal dark:text-[#E8E6E0] rounded-full text-sm font-serif font-semibold border-[0.5px] border-champagne/30">
          {inquiries.length} {inquiries.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      <ul className="space-y-4">
        {inquiries.map((inquiry, index) => (
          <li key={index} className="animate-gentle-fade" style={{ animationDelay: `${index * 60}ms` }}>
            <button
              onClick={() => onQuestionClick?.(inquiry)}
              className="w-full flex items-start gap-5 p-6 rounded-lg bg-pearl/80 dark:bg-charcoal/30 backdrop-blur-sm border-l-4 border-navy/40 dark:border-[#5B89B3]/40 hover:border-navy dark:hover:border-[#5B89B3] hover:shadow-xl transition-all duration-300 text-left group relative overflow-hidden"
            >
              <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-navy to-navy-deep text-pearl rounded-full flex items-center justify-center text-base font-serif font-bold shadow-md group-hover:scale-110 transition-transform border-[0.5px] border-champagne/40">
                {index + 1}
              </span>
              <span className="flex-1 font-body text-lg text-charcoal dark:text-[#E8E6E0] leading-relaxed pt-1.5 group-hover:text-navy dark:group-hover:text-[#5B89B3] transition-colors">
                {inquiry}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
