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
    <div className="h-full flex flex-col bg-parchment-dark/80 dark:bg-ink/30 backdrop-blur-xl border-r-2 border-gold/30">
      {/* Header */}
      <div className="p-6 border-b-2 border-gold/30 bg-parchment/50 dark:bg-ink/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-burgundy dark:text-[#C85A6E]">Questions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gold/20 transition-colors group"
            aria-label="Close sidebar"
          >
            <ArrowLeft size={20} weight="bold" className="text-burgundy dark:text-[#C85A6E] group-hover:text-burgundy-deep dark:group-hover:text-[#C85A6E]" />
          </button>
        </div>
        <p className="text-sm font-body italic text-ink-light dark:text-[#E8DCC8]/70">
          On: <span className="font-semibold text-ink dark:text-[#E8DCC8]">{topic}</span>
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
                ? 'bg-gradient-to-r from-burgundy to-burgundy-deep text-cream shadow-lg border-2 border-gold/40'
                : 'bg-cream/60 dark:bg-ink/30 border-2 border-burgundy/20 dark:border-[#C85A6E]/20 hover:border-burgundy/40 dark:hover:border-[#C85A6E]/40 text-ink dark:text-[#E8DCC8] hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                question === selectedQuestion
                  ? 'bg-cream/20 text-gold border border-gold/30'
                  : 'bg-gradient-to-br from-burgundy to-burgundy-deep text-cream border border-gold/30'
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
