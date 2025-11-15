import { Moon, Sun, Coffee } from '@phosphor-icons/react'

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  minimized?: boolean
}

export function Header({ darkMode, onToggleDarkMode, minimized = false }: HeaderProps) {
  return (
    <header className={`text-center relative transition-all duration-700 ${minimized ? 'mb-6' : 'mb-12'}`}>
      <button
        onClick={onToggleDarkMode}
        className="absolute top-0 right-0 p-3 rounded-full bg-pearl/80 dark:bg-charcoal/60 border-2 border-champagne/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun size={24} weight="fill" className="text-champagne group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon size={24} weight="fill" className="text-navy group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      <div className={`inline-flex items-center justify-center bg-gradient-to-br from-navy to-navy-deep rounded-full shadow-2xl shadow-navy/40 transition-all duration-700 border-4 border-champagne/40 ${minimized ? 'w-14 h-14 mb-3' : 'w-24 h-24 mb-8'}`}>
        <Coffee size={minimized ? 28 : 48} weight="fill" className="text-champagne transition-all duration-700" />
      </div>

      <h1 className={`font-decorative font-bold text-navy dark:text-[#5B89B3] transition-all duration-700 tracking-wide ${minimized ? 'text-2xl md:text-3xl' : 'text-5xl md:text-6xl'}`}>
        Scholar’s Lounge
      </h1>
    </header>
  )
}
