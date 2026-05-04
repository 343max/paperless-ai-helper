import { openAIConfig } from "../config.ts"
import { openAIResponseSchema } from "./openAIRepsonse.ts"

export async function openAIRequest(
  systemRoleMessage: string,
  originalDocumentContent: string,
  temperature: number = 0.7
): Promise<string> {
  const result = await openAIChat(
    [
      { role: "system", content: systemRoleMessage },
      { role: "user", content: originalDocumentContent },
    ],
    temperature
  )
  return result.content
}

export async function openAIChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  temperature: number = 0.7
): Promise<{
  content: string
  messages: { role: "system" | "user" | "assistant"; content: string }[]
}> {
  const { apiKey: api_key, model, baseUrl: base_url } = openAIConfig

  const headers = {
    Authorization: `Bearer ${api_key}`,
    "Content-Type": "application/json",
  }

  const data = {
    model: model,
    messages,
    temperature,
  }

  const response = await fetch(base_url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    console.error("OpenAI response", JSON.stringify(await response.json(), null, 2))
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json = await response.json()
  try {
    const responseData = openAIResponseSchema.parse(json)
    const content = responseData.choices[0].message.content
    return {
      content,
      messages: [...messages, { role: "assistant" as const, content }],
    }
  } catch (error) {
    console.error("OpenAI response data", JSON.stringify(json, null, 2))
    throw error
  }
}
