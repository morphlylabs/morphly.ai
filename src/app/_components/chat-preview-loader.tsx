import { Skeleton } from '~/components/ui/skeleton';

export function ChatPreviewLoader() {
  return (
    <div className="bg-card text-card-foreground h-full cursor-pointer rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      {/* CardHeader skeleton */}
      <div className="mt-1 flex flex-col space-y-1.5 p-6">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      {/* CardContent skeleton */}
      <div className="p-6 pt-0">
        <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-lg">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
