import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import type { Chat } from '~/server/db/schema';

export function ChatPreview({ chat }: { chat: Chat }) {
  return (
    <Link href={`/chat/${chat.id}`} aria-label={`Open chat "${chat.title}"`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="truncate text-base">{chat.title}</CardTitle>
          <CardDescription>
            Created{' '}
            {formatDistanceToNow(chat.createdAt, {
              addSuffix: true,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg">
            {chat.previewImageUrl ? (
              <Image
                src={chat.previewImageUrl}
                alt={chat.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="text-muted-foreground text-sm">
                No preview available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
