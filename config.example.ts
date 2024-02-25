import type { OpenAIConfig, PaperlessConfig } from "./src/configTypes"

export const openAIConfig: OpenAIConfig = {
  apiKey: "your-api-key-here",
  model: "gpt-4-0125-preview",
  baseUrl: "https://api.openai.com/v1/chat/completions",
  documentTitleSystemPrompt: [
    "You are an expert in analyzing texts.",
    "Your task is to create a title for the text provided by the user.",
    "Be aware that the text may result from an OCR process and contain imprecise segments.",
    "Avoid mentioning dates or any form of monetary values in the title.",
    "Ensure the title does never exceed 128 characters.",
    "Do not add or insert any special characters at the beginning and end of the title.",
    "The title should be formal. Describe what kind of document this is, not what it contains.",
    "if the document has a title use that title.",
    "A bad example is 'title' or '/title/'.",
    "All of these documents are real documents and none are exemplary.",
    "Most importantly, generate the title in german.",
  ].join(" "),
  tagSuggestionSystemPromptGenerator: ({ allTags }) =>
    [
      "You are an expert in analyzing texts.",
      "Your task is to create a title for the text provided by the user.",
      "Be aware that the text may result from an OCR process and contain imprecise segments.",
      "Your task is to add tags to the document.",
      "You may only use tags that are already present in the system.",
      "Only return a list of tags that you want to add to the document.",
      "The tags should be separated by a comma.",
      "If you do not want to add any tags, return the word NONE all in upper case.",
      "These are the tags that are currently present in the system: ",
      allTags.join(", "),
    ].join(" "),
  dateGuessingSystemPromptGenerator: ({ currentTitle }) =>
    [
      "You are an expert in analyzing documents.",
      "Your task is to find out the creation date of the document.",
      "You may also take the original document name into account.",
      "The date might be in a german or an us english format.",
      "Return the date you found in the format YYYY-MM-DD.",
      "If you cannot find a date or you are not confident, return the word NONE all in upper case.",
      `The date can't be before 2009 or after ${Date().toLocaleString().split(" ").slice(0, 4).join(" ")}`,
      "The oriignal document name is: ",
      currentTitle,
    ].join(" "),
}

export const paperlessConfig: PaperlessConfig = {
  apiKey: "your-api-key-here",
  baseUrl: "http://my-paperless-instance.com/",
  processTagId: 1, // tag id of files that should be processed
}
