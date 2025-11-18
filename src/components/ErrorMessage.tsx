import { Warning } from '@phosphor-icons/react'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-6 bg-navy/10 dark:bg-navy/20 border-[0.5px] border-navy/30 dark:border-navy/40 rounded-lg flex items-start gap-4 animate-shake mb-6">
      <Warning size={24} weight="fill" className="text-navy dark:text-[#5B89B3] flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-serif font-bold text-navy dark:text-[#5B89B3] mb-2">A Minor Setback</h3>
        <p className="font-body text-charcoal dark:text-[#E8E6E0]/90 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
