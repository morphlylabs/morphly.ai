import { Skeleton } from '@workspace/ui/components/skeleton';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';

export function ChatPreviewLoader() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
