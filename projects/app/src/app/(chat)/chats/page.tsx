import { z } from "zod";
import { Suspense } from "react";
import Chats from "./_components/chats";
import { ChatsLoading } from "./_components/chats-loading";

const paramsSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(9),
});

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = paramsSchema.parse(await searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Chats</h1>
        <p className="text-muted-foreground mt-2">
          View and continue your past conversations
        </p>
      </div>

      <Suspense
        key={params.offset + params.limit}
        fallback={<ChatsLoading count={params.limit} />}
      >
        <Chats offset={params.offset} limit={params.limit} />
      </Suspense>
    </div>
  );
}
