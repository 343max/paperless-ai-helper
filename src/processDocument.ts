import { z } from "zod"
import { openAIConfig } from "../config"
import { openAIRequest } from "./openAIRequest"

export async function processDocument(input: {
  content: string
  title: string
  allTags: string[]
}): Promise<{
  title: string
  tags: string[]
  date: string | null
}> {
  const truncatedContent = input.content.substring(0, openAIConfig.maxContentLength)
  const modelName = openAIConfig.model

  const generateTitle = async () => {
    const result = await openAIRequest(openAIConfig.documentTitleSystemPrompt, truncatedContent)
    console.log(`${modelName} title suggestion: ${result}`)
    return result
  }

  const generateTags = async () => {
    const taggingSystemRoleMessage = openAIConfig.tagSuggestionSystemPromptGenerator({
      allTags: input.allTags,
    })
    const result = await openAIRequest(taggingSystemRoleMessage, truncatedContent, 0.2)
    console.log(`${modelName} tagging suggestion: ${result}`)
    return result
  }

  const guessDate = async () => {
    const result = await openAIRequest(
      openAIConfig.dateGuessingSystemPromptGenerator({ currentTitle: input.title }),
      truncatedContent
    )
    console.log(`${modelName} date guess: ${result}`)
    return result
  }

  const [titleResponse, taggingResponse, dateResponse] = await Promise.all([
    generateTitle(),
    generateTags(),
    guessDate(),
  ])

  const tags = taggingResponse === "NONE" ? [] : taggingResponse.split(", ")

  const date = (() => {
    if (dateResponse === "NONE") return null
    try {
      return z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .parse(dateResponse)
    } catch {
      return null
    }
  })()

  return { title: titleResponse, tags, date }
}
