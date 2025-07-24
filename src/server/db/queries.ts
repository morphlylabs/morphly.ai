import "server-only";

import { db } from "./index";
import { chat, message, stream, type Message } from "./schema";

export const getChatById = async (id: string) => {
  return await db.query.chat.findFirst({
    where: (chat, { eq }) => eq(chat.id, id),
    with: {
      messages: {
        orderBy: (message, { asc }) => asc(message.createdAt),
        with: {
          models: {
            with: {
              stl_file: true,
            },
          },
        },
      },
      stream: true,
    },
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

export const addMessages = async ({ messages }: { messages: Message[] }) => {
  return await db.insert(message).values(messages);
};

export const addStream = async ({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) => {
  return await db.insert(stream).values({ id: streamId, chatId });
};
