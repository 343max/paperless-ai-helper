import { z } from "zod"

export const paperlessTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
})

export type PaperlessTagSchema = z.infer<typeof paperlessTagSchema>
