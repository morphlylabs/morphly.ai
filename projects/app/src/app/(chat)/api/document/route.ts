import {
  getDocumentsById,
  createDocument,
  getChatById,
} from '@/server/db/queries';
import { ChatSDKError, type ChatSDKErrorResponse } from '@/lib/errors';
import { getSession } from '@/lib/auth';
import { postRequestBodySchema } from './schema';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { type Document } from '@/server/db/schema';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<Document[] | ChatSDKErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameter id is missing',
    ).toResponse();
  }

  const session = await getSession();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:document').toResponse();
  }

  const documents: Document[] = await getDocumentsById(id);

  const [document] = documents;

  if (!document) {
    return new ChatSDKError('not_found:document').toResponse();
  }

  if (document.userId !== session.user.id) {
    return new ChatSDKError('forbidden:document').toResponse();
  }

  return NextResponse.json(documents);
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<Document | ChatSDKErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameter chatId is required.',
    ).toResponse();
  }

  const session = await getSession();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:document').toResponse();
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const { content, title, kind } = postRequestBodySchema.parse(
    await request.json(),
  );

  const documents: Document[] = await createDocument({
    chatId,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  if (!documents[0]) {
    return new ChatSDKError('bad_request:database').toResponse();
  }

  return NextResponse.json(documents[0]);
}
