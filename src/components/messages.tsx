import { Message } from "./message";
import { memo } from "react";
import equal from "fast-deep-equal";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useMessages } from "~/hooks/use-messages";
import type { ChatMessage } from "~/lib/types";
import { useDataStream } from "~/components/data-stream-provider";

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
}

function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  regenerate,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });

  useDataStream();

  return (
    <div
      ref={messagesContainerRef}
      className="relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4"
    >
      {messages.map((message, index) => (
        <Message
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
          setMessages={setMessages}
          regenerate={regenerate}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return false;
});
