"use server";

import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  addChatWithMessage,
  addMessage,
  getChatById,
} from "~/server/db/queries";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function createChatWithMessage(formData: FormData): Promise<void> {
  const message = z.string().parse(formData.get("message"));

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const chatId = uuidv4();
  const userMessageId = uuidv4();

  const [createChatResult, aiResponse] = await Promise.all([
    addChatWithMessage({
      chatId,
      messageId: userMessageId,
      content: message,
      title: "New chat",
      userId: session.user.id,
      role: "user",
    }),
    generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: message,
    }),
  ]);

  if (!createChatResult.chat) {
    throw new Error("Failed to create chat");
  }

  const assistantMessageId = uuidv4();
  void addMessage({
    messageId: assistantMessageId,
    chatId,
    content: aiResponse.text,
    role: "assistant",
  });

  redirect(`/chat/${createChatResult.chat.id}`);
}

export async function getChat(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const chat = await getChatById(id);

  if (!chat) {
    redirect("/chat");
  }

  return chat;
}
