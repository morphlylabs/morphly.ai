import type { UIMessage, UIMessagePart } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ChatMessage, CustomUIDataTypes } from "./types";
import type { Message } from "~/server/db/schema";
import { formatISO } from "date-fns";
import { ChatSDKError, type ErrorCode } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUIMessages(messages: Message[]): ChatMessage[] {
  console.log("converting to ui messages", messages);
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts as UIMessagePart<CustomUIDataTypes, never>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function getTextFromUIMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { code, cause } = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new ChatSDKError(code, cause);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json();
};
