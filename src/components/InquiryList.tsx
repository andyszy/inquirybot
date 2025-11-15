interface InquiryListProps {
  topic: string
  inquiries: string[]
}

export function InquiryList({ topic, inquiries }: InquiryListProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Intriguing Inquiries about "{topic}"
        </h2>
        <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
          {inquiries.length} questions
        </span>
      </div>

      <ul className="space-y-3">
        {inquiries.map((inquiry, index) => (
          <li
            key={index}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
              {index + 1}
            </span>
            <span className="flex-1 text-gray-700 dark:text-gray-200 pt-1 font-medium">
              {inquiry}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
