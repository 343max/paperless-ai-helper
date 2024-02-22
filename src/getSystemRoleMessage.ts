import { openAIConfig } from "../config.ts"

function getSystemRoleMessage(): string {
  const { language, documentTitleSystemPrompt: system_role_message } = openAIConfig
  const defaultSystemRoleMessage = `Your task is to create a title for the text provided by the user. Ensure the title does not exceed 128 characters. Generate the title in ${language}.`
  return system_role_message || defaultSystemRoleMessage
}
