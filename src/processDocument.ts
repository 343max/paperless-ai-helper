import { z } from "zod"
import { openAIConfig, paperlessConfig } from "../config"
import { documentDetails } from "./documentDetails"
import { openAIRequest } from "./openAIRequest"
import { systemTags, tagResponseToTagIds, cleanupTags } from "./tags"

export async function processDocument(documentId: number, ignoreMissingProcessTag: boolean = false): Promise<void> {
  console.log(`Document ID ${documentId}: Processing document`)
  console.log(`${paperlessConfig.baseUrl}/documents/${documentId}/details`)

  const paperlessBaseUrl = paperlessConfig.baseUrl
  const paperlessAuthHeader = { Authorization: `Token ${paperlessConfig.apiKey}` }

  const documentUrl = `${paperlessBaseUrl}/api/documents/${documentId}/`

  const tagIdToRemove = paperlessConfig.processTagId

  console.log(`Document ID ${documentId}: Reading document details from paperless.`)
  const documentJson = await documentDetails(documentUrl, paperlessAuthHeader)

  if (!ignoreMissingProcessTag && !documentJson.tags.includes(tagIdToRemove)) {
    console.log(`Document ID ${documentId}: Skipping document, it doesn't have the process tag.`)
    return
  }

  const originalDocumentContent = documentJson.content.substring(0, 3000)
  const originalDocumentTags = documentJson.tags
  const originalDocumentTitle = documentJson.title

  const modelName = openAIConfig.model

  const generateTitle = async () => {
    const openAIResponseContent = await openAIRequest(openAIConfig.documentTitleSystemPrompt, originalDocumentContent)
    console.log(`Document ID ${documentId}: ${modelName} title suggestion: ${openAIResponseContent}`)
    return openAIResponseContent
  }

  const allTags = await systemTags(paperlessBaseUrl, paperlessAuthHeader)

  const generateTags = async () => {
    const taggingSystemRoleMessage = openAIConfig.tagSuggestionSystemPromptGenerator({
      allTags: cleanupTags(allTags, tagIdToRemove),
    })

    const taggingResponse = await openAIRequest(taggingSystemRoleMessage, originalDocumentContent, 0.2)
    console.log(`Document ID ${documentId}: ${modelName} tagging suggestion: ${taggingResponse}`)
    return taggingResponse
  }

  const guessDate = async () => {
    return await openAIRequest(
      openAIConfig.dateGuessingSystemPromptGenerator({ currentTitle: originalDocumentTitle }),
      originalDocumentContent
    )
  }

  const [openAIResponseContent, taggingResponse, dateResponse] = await Promise.all([
    generateTitle(),
    generateTags(),
    guessDate(),
  ])

  const additionalTags = []

  const guessedDate = ((dateResponse: string) => {
    try {
      return z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .parse(dateResponse)
    } catch {
      return null
    }
  })(dateResponse)

  if (guessedDate === null) {
    console.log(`Document ID ${documentId}: Failed to guess a date.`)
    additionalTags.push("ai-date_guess_failed")
  }

  console.log(`Document ID ${documentId}: ${modelName} date guess: ${dateResponse}`)

  const newTags = tagResponseToTagIds([taggingResponse, ...additionalTags].join(", "), allTags)

  let patchData = {
    title: openAIResponseContent,
    tags: [...originalDocumentTags.filter((tag) => tag !== tagIdToRemove), ...newTags],
    ...(guessedDate ? { created_date: guessedDate } : {}),
  }

  const updateResponse = await fetch(documentUrl, {
    method: "PATCH",
    headers: { ...paperlessAuthHeader, "Content-Type": "application/json" },
    body: JSON.stringify(patchData),
  })

  if (updateResponse.status === 200) {
    console.log(`Document ID ${documentId}: Successfully updated.`)
  } else {
    console.log(`Document ID ${documentId}: Error updating the document! Status code ${updateResponse.status}`)
  }
}
