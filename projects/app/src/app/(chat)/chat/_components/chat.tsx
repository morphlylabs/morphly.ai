'use client';

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import Asset from './asset';
import { Button } from '@workspace/ui/components/button';
import { Box, MessageSquare } from 'lucide-react';
import { useChatStore, useSelectedDocument } from '@/stores/chat.store';
import type { Document } from '@/server/db/schema';
import ChatConversation from './chat-conversation';
import AssetActions from './asset-actions';

export function Chat({
  id,
  initialMessages,
  initialDocuments,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialDocuments: Document[];
  autoResume: boolean;
}) {
  const { setChatId, setDocuments } = useChatStore();

  // Set initial documents when component loads
  useEffect(() => {
    setChatId(id);
    setDocuments(initialDocuments);
  }, [id, initialDocuments, setChatId, setDocuments]);

  const [mobileView, setMobileView] = useState<'asset' | 'chat'>('chat');
  const selectedDocument = useSelectedDocument();

  // Switch to asset view on mobile when a new document with STL is available
  useEffect(() => {
    if (selectedDocument?.stlUrl) {
      setMobileView('asset');
    }
  }, [selectedDocument?.stlUrl]);

  return (
    <div className="flex h-full flex-col">
      <div
        className={`relative h-[calc(100vh-4rem-1px)] ${
          selectedDocument?.stlUrl ? 'grid grid-cols-6' : 'flex justify-center'
        }`}
      >
        {selectedDocument?.stlUrl && (
          <div
            className={`bg-accent relative border-r md:col-span-4 md:block ${
              mobileView === 'asset' ? 'col-span-6' : 'hidden'
            }`}
          >
            <Asset src={selectedDocument.stlUrl} />
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <AssetActions />
            </div>
          </div>
        )}

        <div
          className={`h-[calc(100vh-4rem-1px)] overflow-hidden md:col-span-2 md:block ${
            mobileView === 'chat' ? 'col-span-6' : 'hidden'
          }`}
        >
          <ChatConversation
            chatId={id}
            initialMessages={initialMessages}
            autoResume={autoResume}
          />
        </div>

        {/* Mobile view toggle */}
        {selectedDocument?.stlUrl && (
          <div className="absolute top-2 left-2 z-50 lg:hidden">
            <div className="bg-background/80 rounded-lg border p-1 shadow-lg backdrop-blur-sm">
              <div className="relative flex gap-1">
                {/* Sliding background indicator */}
                <div
                  className={`bg-primary absolute top-0 h-full w-1/2 rounded-lg shadow-sm transition-transform duration-200 ease-out ${
                    mobileView === 'chat' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                />

                <Button
                  size="default"
                  variant="ghost"
                  className={`relative z-10 h-10 rounded-full px-3 text-sm font-medium transition-colors duration-200 ${
                    mobileView === 'asset'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setMobileView('asset')}
                  aria-label="Switch to asset view"
                >
                  <Box className="h-4 w-4" />
                  Asset
                </Button>
                <Button
                  size="default"
                  variant="ghost"
                  className={`relative z-10 h-10 rounded-full px-3 text-sm font-medium transition-colors duration-200 ${
                    mobileView === 'chat'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setMobileView('chat')}
                  aria-label="Switch to chat view"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
