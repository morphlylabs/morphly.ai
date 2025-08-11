import { z } from "zod";
import { streamObject } from "ai";
import { codePrompt, updateDocumentPrompt } from "~/lib/ai/prompts";
import { groq } from "@ai-sdk/groq";
import { createDocumentHandler } from "~/lib/artifacts/server";
import { createAsset } from "../../server/db/queries";
import { executeCadQuery } from "../../server/aws/lambda";
import { v4 } from "uuid";
import { put } from "@vercel/blob";

export const codeDocumentHandler = createDocumentHandler<"code">({
  kind: "code",
  onCreateDocument: async ({ title, dataStream, id: documentId }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: groq("meta-llama/llama-4-maverick-17b-128e-instruct"),
      system: codePrompt,
      prompt: title,
      schema: z.object({
        code: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          dataStream.write({
            type: "data-codeDelta",
            data: code ?? "",
            transient: true,
          });

          draftContent = code;
        }
      }
    }

    const cadQueryResponse = await executeCadQuery(draftContent);
    const stlBuffer = Buffer.from(cadQueryResponse.body, "base64");
    const stlBlob = await put(`${title}.stl`, stlBuffer, {
      access: "public",
      contentType: "application/sla",
      addRandomSuffix: true,
    });

    await createAsset({
      id: v4(),
      documentId: documentId,
      format: "stl",
      fileUrl: stlBlob.url,
      status: "completed",
    });

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: groq("meta-llama/llama-4-maverick-17b-128e-instruct"),
      system: updateDocumentPrompt(document.content, "code"),
      prompt: description,
      schema: z.object({
        code: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          dataStream.write({
            type: "data-codeDelta",
            data: code ?? "",
            transient: true,
          });

          draftContent = code;
        }
      }
    }

    return draftContent;
  },
});
