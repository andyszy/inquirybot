import { Sparkle, Moon, Sun } from '@phosphor-icons/react'

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  minimized?: boolean
}

export function Header({ darkMode, onToggleDarkMode, minimized = false }: HeaderProps) {
  return (
    <header className={`text-center relative transition-all duration-500 ${minimized ? 'mb-6' : 'mb-12'}`}>
      <button
        onClick={onToggleDarkMode}
        className="absolute top-0 right-0 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun size={24} weight="fill" className="text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon size={24} weight="fill" className="text-blue-600 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      <div className={`inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl shadow-2xl shadow-blue-500/50 animate-float transition-all duration-500 ${minimized ? 'w-12 h-12 mb-3' : 'w-20 h-20 mb-6'}`}>
        <Sparkle size={minimized ? 24 : 40} weight="fill" className="text-white transition-all duration-500" />
      </div>

      <h1 className={`font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent transition-all duration-500 ${minimized ? 'text-2xl md:text-3xl' : 'text-5xl md:text-6xl'}`}>
        InquiryBot
      </h1>
    </header>
  )
}
