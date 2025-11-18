export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-navy dark:border-[#5B89B3] border-t-transparent"></div>
      <p className="font-body italic text-charcoal-light dark:text-[#E8E6E0]/70 text-lg">
        Crafting thoughtful inquiries…
      </p>
    </div>
  )
}
