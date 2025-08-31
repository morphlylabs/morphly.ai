import { Skeleton } from '@workspace/ui/components/skeleton';
import { ChatPreviewLoader } from './chat-preview-loader';
import { RECENT_CHATS_LIMIT } from './stats';

export function StatsLoader() {
  return (
    <div className="mt-20 flex flex-col gap-8">
      {/* Your Creative Journey Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {/* Total Chats Skeleton */}
          <Skeleton className="h-[100px] w-full" />

          {/* 3D Models Created Skeleton */}
          <Skeleton className="h-[100px] w-full" />

          {/* Chats This Month Skeleton */}
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-80" />
        <div className="grid gap-4 md:grid-cols-3">
          {/* Recent Chat Cards Skeleton */}
          {Array.from({ length: RECENT_CHATS_LIMIT }).map((_, i) => (
            <ChatPreviewLoader key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
