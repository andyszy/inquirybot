export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-cyan-600 border-b-emerald-600 dark:border-t-blue-400 dark:border-r-cyan-400 dark:border-b-emerald-400 rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-cyan-600 dark:bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
        Crafting thoughtful inquiries...
      </p>
    </div>
  )
}
