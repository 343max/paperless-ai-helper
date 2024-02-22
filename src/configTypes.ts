export type OpenAIConfig = {
  apiKey: string
  model: string
  baseUrl: string
  language: string
  documentTitleSystemPrompt: string
  tagSuggestionSystemPromptGenerator: (params: { allTags: string[] }) => string
  dateGuessingSystemPromptGenerator: (params: { currentTitle: string }) => string
}

export type PaperlessConfig = {
  baseUrl: string
  apiKey: string
  processTagId: number
}
