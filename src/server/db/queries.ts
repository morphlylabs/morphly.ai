import "server-only";

import { db } from "./index";
import { chat, document, message, stream, asset, type Message } from "./schema";
import type { ArtifactKind } from "../../components/artifact";
import { ChatSDKError } from "../../lib/errors";

export const getChatById = async (id: string) => {
  return await db.query.chat.findFirst({
    where: (chat, { eq }) => eq(chat.id, id),
    with: {
      messages: {
        orderBy: (message, { asc }) => asc(message.createdAt),
      },
      stream: true,
    },
  });
};

export const getChatsByUserId = async (userId: string) => {
  return await db.query.chat.findMany({
    where: (chat, { eq }) => eq(chat.userId, userId),
    orderBy: (chat, { desc }) => desc(chat.createdAt),
  });
};

export const createChat = async ({
  id,
  createdAt = new Date(),
  userId,
  title,
}: {
  id: string;
  createdAt?: Date;
  userId: string;
  title: string;
}) => {
  return await db.insert(chat).values({ id, createdAt, userId, title });
};

export const getMessagesByChatId = async (chatId: string) => {
  return await db.query.message.findMany({
    where: (message, { eq }) => eq(message.chatId, chatId),
    orderBy: (message, { asc }) => asc(message.createdAt),
  });
};

export const createMessages = async ({ messages }: { messages: Message[] }) => {
  return await db.insert(message).values(messages);
};

export const createStream = async ({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) => {
  return await db.insert(stream).values({ id: streamId, chatId });
};

export const createDocument = async ({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) => {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
};

export const getDocumentsById = async (id: string) => {
  return await db.query.document.findMany({
    where: (document, { eq }) => eq(document.id, id),
  });
};

export const getDocumentById = async (id: string) => {
  return await db.query.document.findFirst({
    where: (document, { eq }) => eq(document.id, id),
    with: {
      assets: true,
    },
  });
};

export const getAssetsByDocumentId = async (id: string) => {
  return await db.query.asset.findMany({
    where: (asset, { eq }) => eq(asset.documentId, id),
  });
};

export const createAsset = async ({
  id,
  documentId,
  format,
  fileUrl,
  status = "completed",
}: {
  id: string;
  documentId: string;
  format: "stl" | "stp";
  fileUrl: string;
  status?: "pending" | "processing" | "completed" | "failed";
}) => {
  try {
    return await db
      .insert(asset)
      .values({
        id,
        documentId,
        format,
        fileUrl,
        status,
        createdAt: new Date(),
      })
      .returning();
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to save asset");
  }
};
