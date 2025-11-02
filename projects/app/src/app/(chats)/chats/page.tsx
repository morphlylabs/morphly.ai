import { Suspense } from 'react';
import { z } from 'zod';
import Chats from './_components/chats';
import { ChatsLoading } from './_components/chats-loading';
import { getChats } from '@/server/db/queries';

const paramsSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(9),
});

async function ChatsContent(props: PageProps<'/chats'>) {
  const { offset, limit } = paramsSchema.parse(await props.searchParams);
  const chats = await getChats(offset, limit);

  return <Chats chats={chats} limit={limit} />;
}

export default async function ChatsPage(props: PageProps<'/chats'>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Chats</h1>
        <p className="text-muted-foreground mt-2">
          View and continue your past conversations
        </p>
      </div>

      <Suspense fallback={<ChatsLoading count={9} />}>
        <ChatsContent {...props} />
      </Suspense>
    </div>
  );
}
