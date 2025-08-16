'use server';

import { generateText, type UIMessage } from 'ai';
import { auth } from '../../lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getChatById,
  getDocumentById,
  setDocumentUrl,
} from '~/server/db/queries';
import { myProvider } from '~/lib/ai/providers';
import { executeCadQuery } from '../../server/aws/lambda';
import { put } from '@vercel/blob';
import type { Document } from '~/server/db/schema';

export async function getChat(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

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
  const stlBuffer = Buffer.from(cadQueryResponse.body, 'base64');
  const stlBlob = await put(`${documentId}.stl`, stlBuffer, {
    access: 'public',
    contentType: 'application/sla',
  });

  const documents = await setDocumentUrl({
    id: documentId,
    url: stlBlob.url,
  });

  if (!documents[0]) throw new Error('Document not found');

  return documents[0];
}
