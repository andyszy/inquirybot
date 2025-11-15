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
        className="absolute top-0 right-0 p-3 rounded-full bg-cream/80 dark:bg-ink/60 border-2 border-gold/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun size={24} weight="fill" className="text-gold group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon size={24} weight="fill" className="text-burgundy group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      <div className={`inline-flex items-center justify-center bg-gradient-to-br from-burgundy to-burgundy-deep rounded-full shadow-2xl shadow-burgundy/40 transition-all duration-700 border-4 border-gold/40 ${minimized ? 'w-14 h-14 mb-3' : 'w-24 h-24 mb-8'}`}>
        <Coffee size={minimized ? 28 : 48} weight="fill" className="text-gold transition-all duration-700" />
      </div>

      <h1 className={`font-decorative font-bold text-burgundy dark:text-[#C85A6E] transition-all duration-700 tracking-wide ${minimized ? 'text-2xl md:text-3xl' : 'text-5xl md:text-6xl'}`}>
        Scholar’s Lounge
      </h1>
    </header>
  )
}
