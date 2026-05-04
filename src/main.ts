import { z } from "zod";
import { processDocument } from "./processDocument.ts";

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve("");
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

const stdinJsonSchema = z.object({
  content: z.string(),
  title: z.string(),
  allTags: z.array(z.string()),
});

const stdinData = await readStdin();
if (!stdinData.trim()) {
  console.error(JSON.stringify({ success: false, error: "No JSON input on stdin" }));
  process.exit(1);
}

try {
  const input = stdinJsonSchema.parse(JSON.parse(stdinData));
  const result = await processDocument(input);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
} catch (error) {
  console.error(JSON.stringify(String(error)));
  process.exit(1);
}
