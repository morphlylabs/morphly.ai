import { z } from "zod";

import type { InferUITool, UIMessage } from "ai";
import type { createDocument } from "./ai/tools/create-document";
import type { updateDocument } from "./ai/tools/update-document";
import type { ArtifactKind } from "../components/artifact";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;

export type ChatTools = {
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  codeDelta: string;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;
