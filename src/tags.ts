import { z } from "zod"
import { paperlessTagSchema, type PaperlessTagSchema } from "./paperless/tag"
import type { PaperlessAuthHeader } from "./types"
import { paperlessTagResponse } from "./paperless/tagResponse"

export async function systemTags(
  paperlessBaseUrl: string,
  paperlessAuthHeader: PaperlessAuthHeader
): Promise<PaperlessTagSchema[]> {
  const tagsUrl = `${paperlessBaseUrl}/api/tags/`

  const response = await fetch(tagsUrl, { headers: paperlessAuthHeader })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const json = await response.json()
  return paperlessTagResponse.parse(json).results
}

export function tagResponseToTagIds(response: string, tags: PaperlessTagSchema[]): number[] {
  const tagNames = response.split(", ")
  return tags.filter((tag) => tagNames.includes(tag.name)).map((tag) => tag.id)
}

export function tagsToString(tags: PaperlessTagSchema[], ignoreTagId: number): string {
  return tags
    .filter((tag) => tag.id !== ignoreTagId)
    .map((tag) => tag.name)
    .join(", ")
}
