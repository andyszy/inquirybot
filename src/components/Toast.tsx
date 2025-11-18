import { useEffect } from 'react'
import { X, CheckCircle } from '@phosphor-icons/react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div className="bg-emerald dark:bg-emerald-deep text-pearl px-6 py-4 rounded-lg shadow-2xl border-[0.5px] border-champagne/40 flex items-center gap-3 min-w-[280px]">
        <CheckCircle size={24} weight="fill" className="text-champagne flex-shrink-0" />
        <span className="font-body text-base flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-pearl/20 rounded transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}

