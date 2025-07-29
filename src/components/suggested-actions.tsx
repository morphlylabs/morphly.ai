"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import { Button } from "./ui/button";
import type { ChatMessage } from "../lib/types";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Create a lamp",
      label: "that has a base and a shade",
      action: "Create a lamp that has a base and a shade",
    },
    {
      title: "Design a chair",
      label: "with armrests and cushions",
      action: "Design a comfortable chair with armrests and cushions",
    },
    {
      title: "Build a vase",
      label: "with decorative patterns",
      action: "Create a decorative vase with intricate patterns and textures",
    },
    {
      title: "Model a house",
      label: "with basic structure",
      action: "Build a simple house with walls, roof, windows, and a door",
    },
  ];

  return (
    <div className="grid w-full gap-1 sm:grid-cols-2">
      {suggestedActions.map((action) => (
        <Button
          key={action.title}
          variant="ghost"
          className="h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border text-left text-sm sm:flex-col"
          onClick={async () => {
            window.history.replaceState({}, "", `/chat/${chatId}`);

            void sendMessage({
              role: "user",
              parts: [{ type: "text", text: action.action }],
            });
          }}
        >
          <span className="font-medium">{action.title}</span>
          <span className="text-muted-foreground text-wrap">
            {action.label}
          </span>
        </Button>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;

    return true;
  },
);
