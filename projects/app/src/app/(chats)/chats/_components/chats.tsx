'use client';

import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@workspace/ui/components/pagination';
import { ChatPreview } from '../../../_components/chat-preview';
import type { Pageable } from '@/lib/types';
import type { Chat } from '@/server/db/schema';
import { Button } from '@workspace/ui/components/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Chats({
  chats,
  limit,
}: {
  chats: Pageable<Chat>;
  limit: number;
}) {
  const router = useRouter();

  const pages = Math.ceil(chats.total / limit);
  const currentPage = Math.floor(chats.offset / limit) + 1;

  let startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(pages, startPage + 3);

  if (endPage - startPage < 3 && pages > 4) {
    startPage = Math.max(1, endPage - 3);
  }

  const pagesToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <>
      {chats.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No chats yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Start a new conversation to see your chats here
            </p>
            <Link
              href="/chat"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            >
              Start New Chat
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chats.items.map(chat => (
              <ChatPreview
                key={chat.id}
                chat={chat}
                cardAction={
                  <Button
                    onClick={async e => {
                      e.preventDefault();

                      const deleteChat = fetch(`/api/chats?chatId=${chat.id}`, {
                        method: 'DELETE',
                      });

                      toast.promise(deleteChat, {
                        loading: 'Deleting chat...',
                        success: () => {
                          // Navigate to previous page if this was the last item on current page
                          if (chats.items.length <= 1 && chats.offset > 0) {
                            router.push(
                              `/chats?offset=${chats.offset - limit}&limit=${limit}`,
                            );
                          } else {
                            router.refresh();
                          }

                          return 'Chat deleted!';
                        },
                        error: 'Failed to delete chat.',
                      });
                    }}
                  >
                    <Trash2 />
                  </Button>
                }
              />
            ))}
          </div>
          {pages > 1 && (
            <Pagination>
              <PaginationContent>
                {pagesToShow.map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`/chats?offset=${(pageNum - 1) * limit}&limit=${limit}`}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {pages > 4 && endPage < pages && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href={`/chats?offset=${(pages - 1) * limit}&limit=${limit}`}
                        isActive={currentPage === pages}
                      >
                        {pages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </>
  );
}
