"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { ChatSDKError } from "~/lib/errors";
import { useChat } from "@ai-sdk/react";
import type { ChatMessage } from "~/lib/types";
import { DefaultChatTransport } from "ai";
import { Loader } from "~/components/ai-elements/loader";

export function HeroPrompt() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const id = useRef(v4());

  const { sendMessage } = useChat<ChatMessage>({
    id: id.current,
    messages: [],
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
    onFinish: () => {
      setIsLoading(false);
      setText("");
      router.push(`/chat/${id.current}`);
    },
    onError: (error) => {
      setIsLoading(false);
      if (error instanceof ChatSDKError) {
        toast.error(error.message);
      } else {
        console.error("Chat error:", error);
        toast.error("An error occurred during chat");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    void sendMessage({ text: text });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          What would you like to create today?
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe your idea and watch it come to life in 3D
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
        {/* TODO: add a view transition */}
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what you want to create..."
          className="py-6 pr-12 text-lg shadow-lg"
          disabled={isLoading}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
          {isLoading ? (
            <div className="flex h-8 w-8 items-center justify-center">
              <Loader size={16} className="text-primary" />
            </div>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 rounded-md transition-transform hover:scale-110"
              disabled={!text.trim()}
              aria-label="Generate"
              title="Generate"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
