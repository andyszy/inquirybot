import { ArrowLeft } from '@phosphor-icons/react'

interface QuestionSidebarProps {
  topic: string
  questions: string[]
  selectedQuestion: string
  onSelectQuestion: (question: string) => void
  onClose: () => void
}

export function QuestionSidebar({
  topic,
  questions,
  selectedQuestion,
  onSelectQuestion,
  onClose
}: QuestionSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-ivory-dark/80 dark:bg-charcoal/30 backdrop-blur-xl border-r-[0.5px] border-champagne/30">
      {/* Header */}
      <div className="p-6 border-b-[0.5px] border-champagne/30 bg-ivory/50 dark:bg-charcoal/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-navy dark:text-[#5B89B3]">Questions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-champagne/20 transition-colors group"
            aria-label="Close sidebar"
          >
            <ArrowLeft size={20} weight="bold" className="text-navy dark:text-[#5B89B3] group-hover:text-navy-deep dark:group-hover:text-[#5B89B3]" />
          </button>
        </div>
        <p className="text-sm font-body italic text-charcoal-light dark:text-[#E8E6E0]/70">
          On: <span className="font-semibold text-charcoal dark:text-[#E8E6E0]">{topic}</span>
        </p>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
              question === selectedQuestion
                ? 'bg-gradient-to-r from-navy to-navy-deep text-pearl shadow-lg border-[0.5px] border-champagne/40'
                : 'bg-pearl/60 dark:bg-charcoal/30 border-[0.5px] border-navy/20 dark:border-[#5B89B3]/20 hover:border-navy/40 dark:hover:border-[#5B89B3]/40 text-charcoal dark:text-[#E8E6E0] hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                question === selectedQuestion
                  ? 'bg-pearl/20 text-champagne border-[0.5px] border-champagne/30'
                  : 'bg-gradient-to-br from-navy to-navy-deep text-pearl border-[0.5px] border-champagne/30'
              }`}>
                {index + 1}
              </span>
              <span className={`flex-1 text-sm font-body leading-snug pt-0.5 ${
                question === selectedQuestion ? 'font-medium' : ''
              }`}>
                {question}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
