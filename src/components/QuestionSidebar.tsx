import { X, ArrowLeft } from '@phosphor-icons/react'

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
    <div className="h-full flex flex-col bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Questions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            aria-label="Close sidebar"
          >
            <ArrowLeft size={20} weight="bold" className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          About: <span className="font-semibold text-gray-900 dark:text-white">{topic}</span>
        </p>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
              question === selectedQuestion
                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 text-gray-900 dark:text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                question === selectedQuestion
                  ? 'bg-white/20 text-white'
                  : 'bg-gradient-to-br from-blue-600 to-emerald-600 text-white'
              }`}>
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-medium leading-snug pt-0.5">
                {question}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
