import { formatDistanceToNow } from 'date-fns';
import { BarChart3, MessageCircle, Box, Zap, Clock } from 'lucide-react';
import {
  getChatAmountForUserThisMonth,
  getChats,
  getDocumentAmountForUser,
} from '~/server/db/queries';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '~/components/ui/card';
import Link from 'next/link';

export const RECENT_CHATS_LIMIT = 3;

export async function Stats() {
  const [[thisMonth], [totalDocuments], recentChats] = await Promise.all([
    getChatAmountForUserThisMonth(),
    getDocumentAmountForUser(),
    getChats(0, RECENT_CHATS_LIMIT),
  ]);

  return (
    <div className="mt-20 flex flex-col gap-8">
      {/* Your Creative Journey */}
      <div className="space-y-6">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <BarChart3 className="h-6 w-6" />
          Your Creative Journey
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {recentChats.total}
                </div>
                <div className="text-muted-foreground text-sm">Total Chats</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                <Box className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalDocuments?.count ?? 0}
                </div>
                <div className="text-muted-foreground text-sm">
                  3D Models Created
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{thisMonth?.count ?? 0}
                </div>
                <div className="text-muted-foreground text-sm">
                  Chats This Month
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      {recentChats.items.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <Clock className="h-5 w-5" />
            Continue Where You Left Off
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recentChats.items.map(chat => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <Card className="h-full cursor-pointer transition-all duration-200 ease-out hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="truncate text-base">
                      {chat.title}
                    </CardTitle>
                    <CardDescription>
                      Created{' '}
                      {formatDistanceToNow(chat.createdAt, {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-lg">
                      <div className="text-muted-foreground text-sm">
                        Image placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
