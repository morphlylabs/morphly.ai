"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { createContext, useEffect, useState, useContext } from "react";
import { Messages } from "~/components/messages";
import { useSearchParams } from "next/navigation";
import { ChatSDKError } from "~/lib/errors";
import type { ChatMessage } from "~/lib/types";
import { useDataStream } from "~/components/data-stream-provider";
import { v4 } from "uuid";
import { useAutoResume } from "~/hooks/use-auto-resume";
import { toast } from "sonner";
import { ChatInput } from "./chat-input";
import { Artifact } from "./artifact";
import type { Asset } from "~/server/db/schema";
import Model from "./model";

// Create context for asset selection
const AssetSelectionContext = createContext<{
  setSelectedAsset: (asset: Asset | undefined) => void;
} | null>(null);

// Hook to use the asset selection context
export const useAssetSelection = () => {
  const context = useContext(AssetSelectionContext);
  if (!context) {
    throw new Error(
      "useAssetSelection must be used within AssetSelectionProvider",
    );
  }
  return context;
};

export function Chat({
  id,
  initialMessages,
  initialAsset,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialAsset?: Asset;
  autoResume: boolean;
}) {
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    initialAsset,
  );

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: v4,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            message: messages.at(-1),
            ...body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast.error(error.message);
      }
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      void sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <AssetSelectionContext.Provider value={{ setSelectedAsset }}>
      <div className="grid h-[calc(100vh-4rem)] grid-cols-4">
        <div className="col-span-3 h-full">
          {selectedAsset && <Model src={selectedAsset.fileUrl} />}
        </div>
        <div className="bg-background col-span-1 flex h-[calc(100vh-4rem)] min-w-0 flex-col">
          <Messages
            chatId={id}
            status={status}
            messages={messages}
            setMessages={setMessages}
            regenerate={regenerate}
          />

          <form className="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
            <ChatInput
              chatId={id}
              input={input}
              setInput={setInput}
              status={status}
              stop={stop}
              messages={messages}
              setMessages={setMessages}
              sendMessage={sendMessage}
            />
          </form>
        </div>

        <Artifact
          chatId={id}
          input={input}
          setInput={setInput}
          status={status}
          stop={stop}
          sendMessage={sendMessage}
          messages={messages}
          setMessages={setMessages}
          regenerate={regenerate}
        />
      </div>
    </AssetSelectionContext.Provider>
  );
}
