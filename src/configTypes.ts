export type OpenAIConfig = {
  apiKey: string
  model: string
  baseUrl: string
  unifiedSystemPrompt: string
  titleUserPrompt: string
  dateUserPromptGenerator: (params: { currentTitle: string }) => string
  tagsUserPromptGenerator: (params: { allTags: string[] }) => string
}

export type PaperlessConfig = {
  baseUrl: string
  apiKey: string
  processTagId: number
}
