import type { UIMessagePart } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ChatMessage, CustomUIDataTypes } from "./types";
import type { Message } from "~/server/db/schema";
import { formatISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUIMessages(messages: Message[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts as UIMessagePart<CustomUIDataTypes, never>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}
