import { Message } from "~/components/message";
import { memo } from "react";
import type { UIArtifact } from "./artifact";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useMessages } from "~/hooks/use-messages";
import type { ChatMessage } from "~/lib/types";

interface ArtifactMessagesProps {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  artifactStatus: UIArtifact["status"];
}

function PureArtifactMessages({
  chatId,
  status,
  messages,
  setMessages,
  regenerate,
}: ArtifactMessagesProps) {
  const { containerRef: messagesContainerRef, hasSentMessage } = useMessages({
    chatId,
    status,
  });

  return (
    <div
      ref={messagesContainerRef}
      className="flex h-full flex-col items-center gap-4 overflow-y-scroll px-4 pt-20"
    >
      {messages.map((message, index) => (
        <Message
          chatId={chatId}
          key={message.id}
          message={message}
          isLoading={status === "streaming" && index === messages.length - 1}
          setMessages={setMessages}
          regenerate={regenerate}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
        />
      ))}
    </div>
  );
}

function areEqual(
  prevProps: ArtifactMessagesProps,
  nextProps: ArtifactMessagesProps,
) {
  if (
    prevProps.artifactStatus === "streaming" &&
    nextProps.artifactStatus === "streaming"
  )
    return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;

  return true;
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual);
