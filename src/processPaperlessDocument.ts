import { paperlessConfig } from "../config";
import { documentDetails } from "./documentDetails";
import { processDocument } from "./processDocument";
import { systemTags, tagResponseToTagIds, cleanupTags } from "./tags";

export async function processPaperlessDocument(
  documentId: number,
  ignoreMissingProcessTag: boolean = false,
): Promise<void> {
  console.log(`Document ID ${documentId}: Processing document`);
  console.log(`${paperlessConfig.baseUrl}/documents/${documentId}/details`);

  const paperlessBaseUrl = paperlessConfig.baseUrl;
  const paperlessAuthHeader = { Authorization: `Token ${paperlessConfig.apiKey}` };
  const documentUrl = `${paperlessBaseUrl}/api/documents/${documentId}/`;
  const tagIdToRemove = paperlessConfig.processTagId;

  console.log(`Document ID ${documentId}: Reading document details from paperless.`);
  const documentJson = await documentDetails(documentUrl, paperlessAuthHeader);
  console.log(`Document ID ${documentId}: ${documentJson.title}`);

  if (!ignoreMissingProcessTag && !documentJson.tags.includes(tagIdToRemove)) {
    console.log(`Document ID ${documentId}: Skipping document, it doesn't have the process tag.`);
    return;
  }

  const allTags = await systemTags(paperlessBaseUrl, paperlessAuthHeader);
  const availableTags = cleanupTags(allTags, tagIdToRemove);

  const result = await processDocument({
    content: documentJson.content,
    title: documentJson.title,
    allTags: availableTags,
  });

  const additionalTags: string[] = [];
  if (result.date === null) {
    console.log(`Document ID ${documentId}: Failed to guess a date.`);
    additionalTags.push("ai-date_guess_failed");
  }

  const newTagIds = tagResponseToTagIds([...result.tags, ...additionalTags].join(", "), allTags);

  const patchData = {
    title: result.title,
    tags: [...documentJson.tags.filter((tag) => tag !== tagIdToRemove), ...newTagIds],
    ...(result.date ? { created_date: result.date } : {}),
  };

  const updateResponse = await fetch(documentUrl, {
    method: "PATCH",
    headers: { ...paperlessAuthHeader, "Content-Type": "application/json" },
    body: JSON.stringify(patchData),
  });

  if (updateResponse.status === 200) {
    console.log(`Document ID ${documentId}: Successfully updated.`);
  } else {
    console.log(
      `Document ID ${documentId}: Error updating the document! Status code ${updateResponse.status}`,
    );
  }
}
