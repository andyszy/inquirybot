export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="flex gap-3">
        <div className="w-3 h-3 bg-burgundy dark:bg-[#C85A6E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-forest dark:bg-[#5FA662] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-gold dark:bg-[#E6C495] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="font-body italic text-ink-light dark:text-[#E8DCC8]/70 text-lg">
        Crafting thoughtful inquiries…
      </p>
    </div>
  )
}
