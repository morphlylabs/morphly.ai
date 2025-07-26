"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
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

export function Chat({
  id,
  initialMessages,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  autoResume: boolean;
}) {
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>("");

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
    <>
      <div className="bg-background flex h-[calc(100vh-4rem)] min-w-0 flex-col">
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
    </>
  );
}
