import { string, z } from "zod"

export const documentIdsResponse = z.object({
  next: z.string().nullable(),
  results: z.array(z.object({ id: z.number() })),
})
