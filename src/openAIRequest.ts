import { openAIConfig } from "../config.ts"
import { openAIResponseSchema } from "./openAIRepsonse.ts"

export async function openAIRequest(
  systemRoleMessage: string,
  originalDocumentContent: string,
  temperature: number = 0.7
): Promise<string> {
  const { apiKey: api_key, model, baseUrl: base_url } = openAIConfig

  const headers = {
    Authorization: `Bearer ${api_key}`,
    "Content-Type": "application/json",
  }

  const data = {
    model: model,
    messages: [
      { role: "system", content: systemRoleMessage },
      { role: "user", content: originalDocumentContent },
    ],
    temperature,
  }

  const response = await fetch(base_url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json = await response.json()
  try {
    const responseData = openAIResponseSchema.parse(json)
    return responseData.choices[0].message.content
  } catch (error) {
    console.error("OpenAI response data", JSON.stringify(json, null, 2))
    throw error
  }
}
