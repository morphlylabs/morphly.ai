"use server";

import { generateText, type UIMessage } from "ai";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getChatById, getAssetsByDocumentId } from "~/server/db/queries";
import { xai } from "@ai-sdk/xai";

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

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: xai("grok-3-mini"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function findStlAssetByDocumentId(documentId: string) {
  const assets = await getAssetsByDocumentId(documentId);
  return assets.find((asset) => asset.format === "stl");
}
