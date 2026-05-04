import { z } from "zod"
import { openAIConfig } from "../config"
import { openAIChat } from "./openAIRequest"

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

  // --- Turn 1: title + establish cache ---
  const titleUserMessage = `${truncatedContent}\n\n${openAIConfig.titleUserPrompt}`

  const { content: titleResponse, messages: contextAfterTitle } = await openAIChat([
    { role: "system", content: openAIConfig.unifiedSystemPrompt },
    { role: "user", content: titleUserMessage },
  ])

  console.log(`${modelName} title suggestion: ${titleResponse}`)

  // --- Turn 2: date (cache hit on doc prefix) ---
  const dateUserMessage = openAIConfig.dateUserPromptGenerator({
    currentTitle: input.title,
  })

  const { content: dateRaw, messages: contextAfterDate } = await openAIChat(
    [...contextAfterTitle, { role: "user", content: dateUserMessage }],
    0.7
  )

  console.log(`${modelName} date guess: ${dateRaw}`)

  // --- Turn 3: tags (cache hit) ---
  const tagsUserMessage = openAIConfig.tagsUserPromptGenerator({
    allTags: input.allTags,
  })

  const { content: tagsRaw } = await openAIChat(
    [...contextAfterDate, { role: "user", content: tagsUserMessage }],
    0.2
  )

  console.log(`${modelName} tagging suggestion: ${tagsRaw}`)

  // --- Parse results ---
  const tags = tagsRaw === "NONE" ? [] : tagsRaw.split(", ")

  const date = (() => {
    if (dateRaw === "NONE") return null
    try {
      return z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .parse(dateRaw)
    } catch {
      return null
    }
  })()

  return { title: titleResponse, tags, date }
}
