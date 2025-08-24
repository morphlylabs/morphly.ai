import 'server-only';

import { db } from './index';
import {
  chat,
  document,
  message,
  stream,
  vote,
  type Document,
  type Message,
  type Vote,
} from './schema';
import type { ArtifactKind } from '~/lib/artifacts/server';
import { ChatSDKError } from '~/lib/errors';
import { and, count, eq, gte } from 'drizzle-orm';
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
 * Fetches the most recent chats for the _authenticated_ user with total count.
 * @param offset - The number of chats to skip. Floored to an integer and clamped to >= 0.
 * @param limit - The number of chats to fetch. Floored to an integer and clamped to >= 1.
 * @returns Object containing `{ items, total, offset, limit }`
 */
export const getChats = async (offset: number, limit: number) => {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.max(1, Math.floor(limit));

  const session = await requireUser();

  const [items, [total]] = await Promise.all([
    db.query.chat.findMany({
      where: (chat, { eq }) => eq(chat.userId, session.user.id),
      orderBy: (chat, { desc }) => desc(chat.createdAt),
      offset: safeOffset,
      limit: safeLimit,
    }),
    db
      .select({ count: count() })
      .from(chat)
      .where(eq(chat.userId, session.user.id)),
  ]);

  return {
    items,
    total: total?.count ?? 0,
    offset: safeOffset,
    limit: safeLimit,
  };
};

export const getChatAmountForUserThisMonth = async () => {
  const session = await requireUser();

  return await db
    .select({ count: count() })
    .from(chat)
    .where(
      and(
        eq(chat.userId, session.user.id),
        gte(chat.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      ),
    );
};

export const getDocumentAmountForUser = async () => {
  const session = await requireUser();

  return await db
    .select({ count: count() })
    .from(document)
    .where(eq(document.userId, session.user.id));
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
  stlUrl,
  stpUrl,
}: {
  id: string;
  stlUrl: string;
  stpUrl: string;
}) => {
  const session = await requireUser();

  return await db
    .update(document)
    .set({ stlUrl, stpUrl })
    .where(and(eq(document.id, id), eq(document.userId, session.user.id)))
    .returning();
};

export const updateChatPreviewImageUrl = async ({
  chatId,
  previewImageUrl,
}: {
  chatId: string;
  previewImageUrl: string;
}) => {
  const session = await requireUser();

  return await db
    .update(chat)
    .set({ previewImageUrl })
    .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)))
    .returning();
};
