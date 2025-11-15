import { Clock, Trash, X } from '@phosphor-icons/react'
import type { Inquiry } from '../types/index.ts'

interface InquiryHistoryProps {
  history: Inquiry[]
  isOpen: boolean
  onClose: () => void
  onSelectInquiry: (inquiry: Inquiry) => void
  onClearHistory: () => void
}

export function InquiryHistory({
  history,
  isOpen,
  onClose,
  onSelectInquiry,
  onClearHistory,
}: InquiryHistoryProps) {
  if (!isOpen) return null

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock size={24} weight="bold" className="text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close history"
            >
              <X size={24} weight="bold" className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Trash size={18} weight="bold" />
              Clear History
            </button>
          )}
        </div>

        <div className="p-6 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} weight="thin" className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No history yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Your explorations will appear here
              </p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectInquiry(item)
                  onClose()
                }}
                className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 dark:hover:from-blue-900/20 dark:hover:to-emerald-900/20 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.topic}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.questions.length} question{item.questions.length !== 1 ? 's' : ''}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  )
}
