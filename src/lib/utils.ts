import type { UIMessage, UIMessagePart } from 'ai';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ChatMessage, ChatTools, CustomUIDataTypes } from './types';
import type { Message, Vote } from '~/server/db/schema';
import { formatISO } from 'date-fns';
import { ChatSDKError } from './errors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUIMessages(
  messages: (Message & { vote?: Vote })[],
): ChatMessage[] {
  return messages.map(message => ({
    id: message.id,
    role: message.role,
    parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
      vote: message.vote ? message.vote.isUpvote : undefined,
    },
  }));
}

export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('');
}

export function getTextFromUIMessage(message: UIMessage): string {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('');
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

/**
 * Downloads a file from a given URL with a specified filename
 * @param fileUrl - The URL of the file to download
 * @param filename - The name to save the file as
 * @throws Error if the download fails
 */
export const downloadFileFromUrl = async (
  fileUrl: string,
  filename: string,
): Promise<void> => {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const blob = await response.blob();

  // Create a temporary URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
