import { paperlessDocumentSchema, type PaperlessDocumentSchema } from "./paperless/document"

export async function fetchDocumentDetails(
  url: string,
  headers: Record<string, string>
): Promise<PaperlessDocumentSchema> {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return paperlessDocumentSchema.parse(await response.json())
}
