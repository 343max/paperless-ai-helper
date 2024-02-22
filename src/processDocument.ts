import { openAIConfig, paperlessConfig } from "../config"
import { documentDetails } from "./documentDetails"
import { openAIRequest } from "./openAIRequest"
import { systemTags, tagResponseToTagIds, tagsToString } from "./tags"

export async function processDocument(documentId: number): Promise<void> {
  console.log(`Document ID ${documentId}: Processing document`)

  const paperlessBaseUrl = paperlessConfig.baseUrl
  const paperlessAuthHeader = { Authorization: `Token ${paperlessConfig.apiKey}` }

  const documentUrl = `${paperlessBaseUrl}/api/documents/${documentId}/`

  const tagIdToRemove = paperlessConfig.processTagId

  const allTags = await systemTags(paperlessBaseUrl, paperlessAuthHeader)
  const allTagsString = tagsToString(allTags, tagIdToRemove)

  const taggingSystemRoleMessage =
    openAIConfig.tagSuggestionSystemPrompt +
    "These are the tags that are currently present in the system: " +
    allTagsString

  console.log(`Document ID ${documentId}: Reading document details from paperless.`)
  const documentJson = await documentDetails(documentUrl, paperlessAuthHeader)

  const originalDocumentContent = documentJson.content
  const originalDocumentTags = documentJson.tags

  const openAIResponseContent = await openAIRequest(openAIConfig.documentTitleSystemPrompt, originalDocumentContent)
  console.log(`Document ID ${documentId}: OpenAI title suggestion: ${openAIResponseContent}`)

  const taggingResponse = await openAIRequest(taggingSystemRoleMessage, originalDocumentContent)
  const newTags = tagResponseToTagIds(taggingResponse, allTags)
  console.log(`Document ID ${documentId}: OpenAI tagging suggestion: ${taggingResponse}`)

  let patchData = {
    title: openAIResponseContent,
    tags: [...originalDocumentTags.filter((tag) => tag !== tagIdToRemove), ...newTags],
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
