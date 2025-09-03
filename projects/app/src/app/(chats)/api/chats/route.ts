import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { deleteChatById, getChats } from '@/server/db/queries';
import type { Chat } from '@/server/db/schema';
import type { Pageable } from '@/lib/types';
import { limitSchema, offsetSchema } from './schema';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<Pageable<Chat>>> {
  const offset = request.nextUrl.searchParams.get('offset');
  const limit = request.nextUrl.searchParams.get('limit');

  const parsedOffset = offsetSchema.parse(offset);
  const parsedLimit = limitSchema.parse(limit);

  const chats = await getChats(parsedOffset, parsedLimit);

  return NextResponse.json(chats);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const chatId = request.nextUrl.searchParams.get('chatId');

  if (!chatId) {
    return new NextResponse('Chat ID is required', { status: 400 });
  }

  await deleteChatById(chatId);

  return NextResponse.json({ success: true });
}
