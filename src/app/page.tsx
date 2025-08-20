import {
  getChats,
  getDocumentAmountForUser,
  getChatAmountForUserThisMonth,
} from '~/server/db/queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Clock, Box, BarChart3, Zap, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { HeroPrompt } from '~/components/hero-prompt';

const RECENT_CHATS_LIMIT = 3;

export default async function HomePage() {
  const [recentChats, [thisMonth], [totalDocuments]] = await Promise.all([
    getChats(0, RECENT_CHATS_LIMIT),
    getChatAmountForUserThisMonth(),
    getDocumentAmountForUser(),
  ]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Live Generator Section */}
        <HeroPrompt />

        {/* Your Creative Journey */}
        <div className="mt-20 space-y-6">
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
                  <div className="text-muted-foreground text-sm">
                    Total Chats
                  </div>
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
            <h2 className="flex items-center gap-2 text-xl font-semibold">
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
    </div>
  );
}
