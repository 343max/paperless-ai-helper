import { z } from "zod"

export const paperlessDocumentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.number()),
  created_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  created: z.coerce.date(),
  modified: z.coerce.date(),
  added: z.coerce.date(),
})

export type PaperlessDocumentSchema = z.infer<typeof paperlessDocumentSchema>
