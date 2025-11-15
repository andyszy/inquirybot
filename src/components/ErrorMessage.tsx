import { Warning } from '@phosphor-icons/react'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-6 bg-burgundy/10 dark:bg-burgundy/20 border-2 border-burgundy/30 dark:border-burgundy/40 rounded-lg flex items-start gap-4 animate-shake mb-6">
      <Warning size={24} weight="fill" className="text-burgundy dark:text-[#C85A6E] flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-serif font-bold text-burgundy dark:text-[#C85A6E] mb-2">A Minor Setback</h3>
        <p className="font-body text-ink dark:text-[#E8DCC8]/90 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
