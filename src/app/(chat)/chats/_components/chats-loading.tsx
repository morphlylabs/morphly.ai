import { Skeleton } from '~/components/ui/skeleton';

export function ChatsLoading({ count = 9 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-card text-card-foreground h-full cursor-pointer rounded-xl border shadow-sm transition-shadow hover:shadow-md"
          >
            {/* CardHeader skeleton */}
            <div className="mt-1 flex flex-col space-y-2 p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            {/* CardContent skeleton */}
            <div className="p-6 pt-0">
              <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-lg">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
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
