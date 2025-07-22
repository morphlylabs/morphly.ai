import "server-only";

import { db } from "./index";
import { chat, message } from "./schema";

export const getChatById = async (id: string) => {
  return await db.query.chat.findFirst({
    where: (chat, { eq }) => eq(chat.id, id),
    with: {
      messages: {
        orderBy: (message, { asc }) => asc(message.createdAt),
      },
    },
  });
};

export const addChatWithMessage = async ({
  chatId,
  messageId,
  content,
  title,
  userId,
  role,
}: {
  chatId: string;
  messageId: string;
  content: string;
  title: string;
  userId: string;
  role: "user" | "assistant";
}) => {
  return await db.transaction(async (tx) => {
    const newChat = await tx
      .insert(chat)
      .values({
        id: chatId,
        userId,
        title,
      })
      .returning();

    const newMessage = await tx
      .insert(message)
      .values({
        id: messageId,
        chatId,
        role,
        content,
      })
      .returning();

    return {
      chat: newChat[0],
      message: newMessage[0],
    };
  });
};

export const addMessage = async ({
  messageId,
  chatId,
  content,
  role,
}: {
  messageId: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
}) => {
  return await db.insert(message).values({
    id: messageId,
    chatId,
    role,
    content,
  });
};
