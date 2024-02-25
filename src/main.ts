import { z } from "zod"
import { paperlessConfig } from "../config.ts"
import { findDocumentsWithTagId } from "./findDocumentsWithTagId.ts"
import { processDocument } from "./processDocument.ts"

import express from "express"

const app = express()
const port = 8080

const main = async () => {
  try {
    const documentIds = await findDocumentsWithTagId(paperlessConfig.processTagId)

    if (documentIds.length === 0) {
      console.log("No documents to process. going back to sleep.")
      return
    }

    console.log(`Will process these documents: ${JSON.stringify(documentIds)}`)

    for (const documentId of documentIds) {
      await processDocument(documentId)
    }
  } catch (error) {
    console.error(error)
  }
}

app.post("/process/:documentId", async (req, res) => {
  const documentId = parseInt(z.object({ documentId: z.string() }).parse(req.params).documentId)
  try {
    await processDocument(documentId, true)

    res.send(JSON.stringify({ success: true }))
  } catch (error) {
    console.error(error)
    res.send(JSON.stringify({ success: false }))
  }
})

app.post("/process", async (req, res) => {
  try {
    await main()

    res.send(JSON.stringify({ success: true }))
  } catch (error) {
    console.error(error)
    res.send(JSON.stringify({ success: false }))
  }
})

setInterval(main, 1000 * 60 * 3)

main()

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
