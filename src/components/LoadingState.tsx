export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="flex gap-3">
        <div className="w-3 h-3 bg-navy dark:bg-[#5B89B3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-emerald dark:bg-[#4A9D7B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-champagne dark:bg-[#E6C76E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="font-body italic text-charcoal-light dark:text-[#E8E6E0]/70 text-lg">
        Crafting thoughtful inquiries…
      </p>
    </div>
  )
}
