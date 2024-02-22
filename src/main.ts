import { paperlessConfig } from "../config.ts"
import { findDocumentsWithTagId } from "./findDocumentsWithTagId.ts"
import { processDocument } from "./processDocument.ts"

// Usage example
processDocument(624)

const main = async () => {
  const documentIds = await findDocumentsWithTagId(paperlessConfig.processTagId)

  console.log(`Will process these documents: ${JSON.stringify(documentIds)}`)

  for (const documentId of documentIds) {
    await processDocument(documentId)
  }
}

// await main()
