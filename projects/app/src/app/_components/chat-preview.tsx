import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { formatDistanceToNow } from "date-fns";
import type { Chat } from "@/server/db/schema";
import { Clock } from "lucide-react";

export function ChatPreview({
  chat,
  priority = false,
}: {
  chat: Chat;
  priority?: boolean;
}) {
  return (
    <Link href={`/chat/${chat.id}`} aria-label={`Open chat "${chat.title}"`}>
      <Card className="hover:border-primary/20 h-full transition-all hover:scale-[1.02] hover:shadow-lg">
        <CardHeader>
          <CardTitle className="truncate text-base">{chat.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {formatDistanceToNow(chat.createdAt, {
                addSuffix: true,
              })}
            </div>
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
                priority={priority}
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
