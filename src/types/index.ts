export interface Inquiry {
  id: string
  topic: string
  questions: string[]
  timestamp: number
}

export interface InquiryItem {
  text: string
  copied?: boolean
}
