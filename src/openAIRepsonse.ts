import { z } from "zod"

export const openAIResponseSchema = z.object({
  choices: z.array(
    z.object({
      finish_reason: z.string(),
      index: z.number(),
      message: z.object({
        content: z.string(),
        role: z.string(),
      }),
      logprobs: z.null().optional(),
    })
  ),
  created: z.number(),
  id: z.string(),
  model: z.string(),
  object: z.string(),
  usage: z.object({
    completion_tokens: z.number(),
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
})

export type OpenAIResponseSchema = z.infer<typeof openAIResponseSchema>
