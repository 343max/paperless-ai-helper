import { z } from "zod"

export const paperlessDocumentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.number()),
  created: z.string(),
  created_date: z.string(),
  modified: z.string(),
  added: z.string(),
})

export type PaperlessDocumentSchema = z.infer<typeof paperlessDocumentSchema>
