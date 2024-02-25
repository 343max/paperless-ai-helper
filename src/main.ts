import { z } from "zod"
import { paperlessConfig } from "../config.ts"
import { findDocumentsWithTagId } from "./findDocumentsWithTagId.ts"
import { processDocument } from "./processDocument.ts"

import express from "express"

const app = express()
const port = 8080

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.post("/process/:documentId", async (req, res) => {
  const documentId = parseInt(z.object({ documentId: z.string() }).parse(req.params).documentId)
  await processDocument(documentId)
})

app.post("/ping", async (req, res) => {
  const documentIds = await findDocumentsWithTagId(paperlessConfig.processTagId)

  console.log(`Will process these documents: ${JSON.stringify(documentIds)}`)

  for (const documentId of documentIds) {
    await processDocument(documentId)
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
