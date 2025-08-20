'use server';

import { generateText, type UIMessage } from 'ai';
import { redirect } from 'next/navigation';
import {
  createOrUpdateVote,
  getChatById,
  getDocumentById,
  updateChatPreviewImageUrl,
  updateDocumentUrl,
} from '~/server/db/queries';
import { myProvider } from '~/lib/ai/providers';
import { executeCadQuery } from '../../server/aws/lambda';
import type { Document } from '~/server/db/schema';

export async function getChat(id: string) {
  const chat = await getChatById(id);

  if (!chat) {
    redirect('/chat');
  }

  return chat;
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function executeDocumentCodeAndPopulateUrl(
  documentId: string,
): Promise<Document> {
  const document = await getDocumentById(documentId);
  if (!document?.content) throw new Error('Document not found');
  if (document.fileUrl) return document;

  const cadQueryResponse = await executeCadQuery(document.content);

  const documents = await updateDocumentUrl({
    id: documentId,
    stl_url: cadQueryResponse.body.stl_url,
  });

  void updateChatPreviewImageUrl({
    id: document.chatId,
    svg_url: cadQueryResponse.body.svg_url,
  });

  if (!documents[0]) throw new Error('Document not found');

  return documents[0];
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  await createOrUpdateVote({ chatId, messageId, type });
}
