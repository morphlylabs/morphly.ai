import { Skeleton } from '@workspace/ui/components/skeleton';
import { ChatPreviewLoader } from '../../../_components/chat-preview-loader';

export function ChatsLoading({ count = 9 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <ChatPreviewLoader key={i} />
        ))}
      </div>
      {/* Pagination skeleton */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
