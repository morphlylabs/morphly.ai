"use client";

import { memo, useState } from "react";
import equal from "fast-deep-equal";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "~/lib/types";
import { useDataStream } from "~/components/data-stream-provider";
import { PencilIcon, SparklesIcon, Loader2 } from "lucide-react";
import { DocumentToolResult } from "./document";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const PureMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  regenerate,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  useDataStream();

  return (
    <div
      key={`wrapper-${message.id}`}
      className="group/message"
      data-role={message.role}
    >
      <div
        className={cn(
          "flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
          {
            "w-full": mode === "edit",
            "group-data-[role=user]/message:w-fit": mode !== "edit",
          },
        )}
      >
        {message.role === "assistant" && (
          <div className="ring-border bg-background flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
            <div className="translate-y-px">
              <SparklesIcon size={14} />
            </div>
          </div>
        )}

        <div
          className={cn("flex w-full flex-col gap-4", {
            "min-h-96": message.role === "assistant" && requiresScrollPadding,
          })}
        >
          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === "text") {
              if (mode === "view") {
                return (
                  <div key={key} className="flex flex-row items-start gap-2">
                    {message.role === "user" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            data-testid="message-edit-button"
                            variant="ghost"
                            className="text-muted-foreground h-fit rounded-full px-2 opacity-0 group-hover/message:opacity-100"
                            onClick={() => {
                              setMode("edit");
                            }}
                          >
                            <PencilIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit message</TooltipContent>
                      </Tooltip>
                    )}

                    <div
                      data-testid="message-content"
                      className={cn("flex flex-col gap-4", {
                        "bg-primary text-primary-foreground rounded-xl px-3 py-2":
                          message.role === "user",
                      })}
                    >
                      {part.text}
                    </div>
                  </div>
                );
              }
            }

            if (type === "tool-createDocument") {
              const { toolCallId, state } = part;

              if (state === "input-available") {
                return (
                  <div key={toolCallId} className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating asset...</span>
                  </div>
                );
              }

              if (state === "output-available") {
                const { output } = part;

                if (output && typeof output === "object" && "error" in output) {
                  return (
                    <div
                      key={toolCallId}
                      className="rounded border p-2 text-red-500"
                    >
                      Error: {String(output.error)}
                    </div>
                  );
                }

                return (
                  <div key={toolCallId}>
                    <DocumentToolResult result={output} />
                  </div>
                );
              }
            }

            if (type === "tool-updateDocument") {
              const { toolCallId, state } = part;

              if (state === "input-available") {
                const { input } = part;

                return (
                  <div key={toolCallId}>
                    {JSON.stringify(input)}
                    {/* <DocumentToolCall
                    type="update"
                    args={input}
                    isReadonly={isReadonly}
                  /> */}
                  </div>
                );
              }

              if (state === "output-available") {
                const { output } = part;

                if (output && typeof output === "object" && "error" in output) {
                  return (
                    <div
                      key={toolCallId}
                      className="rounded border p-2 text-red-500"
                    >
                      Error: {String(output.error)}
                    </div>
                  );
                }

                return (
                  <div key={toolCallId}>
                    <DocumentToolResult result={output} />
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </div>
  );
};

export const Message = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
    return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

  return true;
});
