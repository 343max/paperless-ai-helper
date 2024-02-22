import { paperlessConfig } from "../config"
import { documentIdsResponse } from "./paperless/documentIdsResponse"

export async function findDocumentsWithTagId(tagId: number): Promise<number[]> {
  const paperlessBaseUrl = paperlessConfig.baseUrl
  const paperlessAuthHeader = { Authorization: `Token ${paperlessConfig.apiKey}` }
  let documentsUrl: string | null = `${paperlessBaseUrl}/api/documents/?is_tagged=true&tags__id__all=${tagId}&fields=id`

  const allDocumentIds: number[] = []

  while (documentsUrl) {
    const response = await fetch(documentsUrl, { headers: paperlessAuthHeader })

    if (response.ok) {
      const data = documentIdsResponse.parse(await response.json())
      const documentIds = data.results.map((doc: { id: number }) => doc.id)
      allDocumentIds.push(...documentIds)

      documentsUrl = data.next || null
    } else if (response.status === 404) {
      console.log("No documents found for the specified tag.")
      return []
    } else {
      console.log(`Error: Received status code ${response.status}`)
      return []
    }
  }

  return allDocumentIds
}
