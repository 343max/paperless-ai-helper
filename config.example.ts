import type { OpenAIConfig, PaperlessConfig } from "./src/configTypes";

export const openAIConfig: OpenAIConfig = {
  apiKey: "your-api-key-here",
  model: "gpt-4-0125-preview",
  baseUrl: "https://api.openai.com/v1/chat/completions",
  unifiedSystemPrompt: [
    "Hier ist der Anfang eines Dokuments zum Analysieren. Bitte lies es sorgfältig durch. Ich werde dir im Anschluss ein paar Fragen stellen.",
    "Bitte beachte, dass das Dokument durch den Scan merkwürdige Text Artefakte enthalten kann.",
  ].join(" "),
  titleUserPrompt: [
    "Erstelle einen Titel für dieses Dokument.",
    "Regeln:",
    "- Keine Datumsangaben oder Geldbeträge im Titel",
    "- Maximal 128 Zeichen",
    "- Keine Sonderzeichen am Anfang oder Ende",
    "- Formal und beschreibend (Dokumenttyp, nicht Inhalt)",
    "- Falls das Dokument bereits einen Titel hat, verwende diesen",
    "- Antworte NUR mit dem Titel, sonst nichts",
  ].join("\n"),
  dateUserPromptGenerator: ({ currentTitle }) =>
    [
      "Ermittle das Erstellungsdatum des Dokuments.",
      "Das Datum kann im deutschen oder US-englischen Format vorliegen.",
      `Das Datum darf nicht vor 2009 oder nach ${new Date().getFullYear()} liegen.`,
      `Der Original-Dateiname ist: ${currentTitle}`,
      "Antworte im Format YYYY-MM-DD.",
      'Falls kein Datum ermittelbar ist, antworte mit "NONE".',
      "Antworte NUR mit dem Datum oder NONE, sonst nichts.",
    ].join("\n"),
  tagsUserPromptGenerator: ({ allTags }) =>
    [
      "Schlage Tags für dieses Dokument vor.",
      `Verfügbare Tags: ${allTags.join(", ")}`,
      "Wähle NUR aus dieser Liste.",
      "Trenne die Tags mit Komma.",
      'Falls keine Tags passen, antworte mit "NONE".',
      "Antworte NUR mit den Tags oder NONE, sonst nichts.",
    ].join("\n"),
};

export const paperlessConfig: PaperlessConfig = {
  apiKey: "your-api-key-here",
  baseUrl: "http://my-paperless-instance.com/",
  processTagId: 1, // tag id of files that should be processed
};
