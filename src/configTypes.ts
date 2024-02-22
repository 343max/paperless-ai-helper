export type OpenAIConfig = {
  apiKey: string
  model: string
  baseUrl: string
  language: string
  documentTitleSystemPrompt: string
  tagSuggestionSystemPrompt: string
}

export type PaperlessConfig = {
  baseUrl: string
  apiKey: string
  processTagId: number
}
