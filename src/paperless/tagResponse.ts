import { z } from "zod"
import { paperlessTagSchema } from "./tag"

export const paperlessTagResponse = z.object({
  results: z.array(paperlessTagSchema),
})
