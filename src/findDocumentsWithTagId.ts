import { paperlessConfig } from "../config"
import { documentIdsResponse } from "./paperless/documentIdsResponse"

export async function findDocumentsWithTagId(tagId: number): Promise<number[]> {
  const paperlessBaseUrl = paperlessConfig.baseUrl
  const paperlessAuthHeader = { Authorization: `Token ${paperlessConfig.apiKey}` }
  const documentsUrl = `${paperlessBaseUrl}/api/documents/?is_tagged=true&tags__id__all=${tagId}&fields=id`

  const response = await fetch(documentsUrl, { headers: paperlessAuthHeader })
  return documentIdsResponse.parse(await response.json()).results.map((doc: { id: number }) => doc.id)
}
