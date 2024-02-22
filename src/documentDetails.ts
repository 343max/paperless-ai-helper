import { paperlessDocumentSchema, type PaperlessDocumentSchema } from "./paperless/document"
import type { PaperlessAuthHeader } from "./types"

export async function documentDetails(
  documentUrl: string,
  paperlessAuthHeader: PaperlessAuthHeader
): Promise<PaperlessDocumentSchema> {
  const response = await fetch(documentUrl, { headers: paperlessAuthHeader })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const json = await response.json()
  try {
    return paperlessDocumentSchema.parse(json)
  } catch (error) {
    console.error(`json: ${JSON.stringify(json, undefined, 2)}`)
    throw error
  }
}
