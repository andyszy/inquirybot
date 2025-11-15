import { Warning } from '@phosphor-icons/react'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-4 animate-shake">
      <Warning size={24} weight="fill" className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Oops! Something went wrong</h3>
        <p className="text-red-700 dark:text-red-300">{message}</p>
      </div>
    </div>
  )
}
