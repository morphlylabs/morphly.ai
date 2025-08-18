import 'server-only';

import { db } from './index';
import {
  chat,
  document,
  message,
  stream,
  vote,
  type Chat,
  type Document,
  type Message,
  type Vote,
} from './schema';
import type { ArtifactKind } from '~/lib/artifacts/server';
import { ChatSDKError } from '~/lib/errors';
import { and, eq } from 'drizzle-orm';
import { v4 } from 'uuid';
import { requireUser } from '~/lib/require-user';

export const getChatById = async (id: string) => {
  const session = await requireUser();

  return await db.query.chat.findFirst({
    where: (chat, { eq, and }) =>
      and(eq(chat.id, id), eq(chat.userId, session.user.id)),
    with: {
      messages: {
        orderBy: (message, { asc }) => asc(message.createdAt),
      },
      stream: true,
      documents: {
        orderBy: (document, { asc }) => asc(document.createdAt),
      },
    },
  });
};

/**
 * Fetches all chats for the _authenticated_ user.
 * @returns {Promise<Array>} Array of chats ordered by creation date (newest first)
 */
export const getChatsForUser = async (): Promise<Chat[]> => {
  const session = await requireUser();

  return await db.query.chat.findMany({
    where: (chat, { eq }) => eq(chat.userId, session.user.id),
    orderBy: (chat, { desc }) => desc(chat.createdAt),
  });
};

export const createChat = async ({
  id = v4(),
  createdAt = new Date(),
  userId,
  title,
}: {
  id?: string;
  createdAt?: Date;
  userId: string;
  title: string;
}) => {
  const session = await requireUser();

  if (session.user.id !== userId) {
    throw new ChatSDKError('forbidden:auth', 'Forbidden');
  }

  return await db.insert(chat).values({ id, createdAt, userId, title });
};

export const getMessagesByChatId = async (
  chatId: string,
): Promise<Message[]> => {
  await requireUser();

  return await db.query.message.findMany({
    where: (message, { eq }) => eq(message.chatId, chatId),
    orderBy: (message, { asc }) => asc(message.createdAt),
  });
};

export const createMessages = async ({ messages }: { messages: Message[] }) => {
  await requireUser();

  return await db.insert(message).values(messages);
};

export const createStream = async ({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) => {
  await requireUser();

  return await db.insert(stream).values({ id: streamId, chatId });
};

export const getVotesByChatId = async (chatId: string): Promise<Vote[]> => {
  await requireUser();
  return await db.query.vote.findMany({
    where: (vote, { eq }) => eq(vote.chatId, chatId),
  });
};

export const createOrUpdateVote = async ({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) => {
  await requireUser();

  const isUpvote = type === 'up';

  return await db
    .insert(vote)
    .values({ chatId, messageId, isUpvote })
    .onConflictDoUpdate({
      target: [vote.chatId, vote.messageId],
      set: { isUpvote },
    });
};

export const createDocument = async ({
  id = v4(),
  chatId,
  title,
  kind,
  content,
  userId,
}: {
  id?: string;
  chatId: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) => {
  await requireUser();

  try {
    return await db
      .insert(document)
      .values({
        id,
        chatId,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch {
    throw new ChatSDKError('bad_request:database', 'Failed to save document');
  }
};

export const getDocumentsById = async (id: string): Promise<Document[]> => {
  const session = await requireUser();

  return await db.query.document.findMany({
    where: (document, { eq, and }) =>
      and(eq(document.id, id), eq(document.userId, session.user.id)),
    orderBy: (document, { asc }) => asc(document.createdAt),
  });
};

export const getDocumentById = async (
  id: string,
): Promise<Document | undefined> => {
  const session = await requireUser();

  return await db.query.document.findFirst({
    where: (document, { eq, and }) =>
      and(eq(document.id, id), eq(document.userId, session.user.id)),
  });
};

export const updateDocumentUrl = async ({
  id,
  url,
}: {
  id: string;
  url: string;
}) => {
  const session = await requireUser();

  return await db
    .update(document)
    .set({ fileUrl: url })
    .where(and(eq(document.id, id), eq(document.userId, session.user.id)))
    .returning();
};
