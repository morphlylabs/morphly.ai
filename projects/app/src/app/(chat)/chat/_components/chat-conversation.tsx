'use client';

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  MessageContent,
  Message,
  MessageAvatar,
} from '@/components/ai-elements/message';
import type { ChatMessage } from '@/lib/types';
import { DocumentToolResult } from '@/components/document';
import { ThumbsUp, ThumbsDown, X, MicIcon } from 'lucide-react';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';
import { useDataStream, useSelectedDocument } from '@/stores/chat.store';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Action, Actions } from '@/components/ai-elements/actions';
import type { Vote } from '@/server/db/schema';
import { fetcher } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { v4 } from 'uuid';
import { useState } from 'react';
import { chatSDKErrorSchema } from '@/lib/errors';
import { useSelectedModel } from '@/stores/model.store';
import { Separator } from '@workspace/ui/components/separator';
import { ModelSelector } from './model-selector';

const suggestions = [
  'Create a lamp that has a base and a shade',
  'Design a comfortable chair with armrests and cushions',
  'Create a decorative vase with intricate patterns and textures',
  'Build a simple house with walls, roof, windows, and a door',
];

export default function ChatConversation({
  chatId,
  initialMessages,
  autoResume,
}: {
  chatId: string;
  initialMessages: ChatMessage[];
  autoResume: boolean;
}) {
  const { processDataStreamUpdate } = useDataStream();

  const [text, setText] = useState<string>('');
  const model = useSelectedModel();
  const selectedDocument = useSelectedDocument();

  const { messages, setMessages, sendMessage, status, resumeStream } =
    useChat<ChatMessage>({
      id: chatId,
      messages: initialMessages,
      experimental_throttle: 100,
      generateId: v4,
      transport: new DefaultChatTransport({
        api: '/api/chat',
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
      onData: dataPart => {
        processDataStreamUpdate(dataPart);
      },
      onError: error => {
        const parsed = chatSDKErrorSchema.safeParse(JSON.parse(error.message));

        if (!parsed.success) {
          console.error('Chat error:', error.message);
          toast.error('An error occurred during chat');
          return;
        }

        toast.error(parsed.data.message);
      },
    });

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${chatId}` : null,
    fetcher,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendMessage(
      { text: text },
      {
        body: {
          model: model,
        },
      },
    );
    setText('');
    window.history.replaceState({}, '', `/chat/${chatId}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    void sendMessage(
      { text: suggestion },
      {
        body: {
          model: model,
        },
      },
    );
    setText('');
    window.history.replaceState({}, '', `/chat/${chatId}`);
  };

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Conversation>
          <ConversationContent>
            {messages.map(message => (
              <div className="group flex flex-col" key={message.id}>
                <Message from={message.role}>
                  <MessageContent>
                    {message.parts.map(part => {
                      switch (part.type) {
                        case 'text':
                          return <p key={part.text}>{part.text}</p>;
                        case 'tool-createDocument':
                          if (part.state === 'input-available') {
                            return (
                              <p key={part.toolCallId}>Generating asset...</p>
                            );
                          } else if (part.state === 'output-available') {
                            return (
                              <DocumentToolResult
                                key={part.toolCallId}
                                result={part.output}
                              />
                            );
                          } else if (part.state === 'output-error') {
                            return (
                              <div key={part.toolCallId}>
                                <X className="mr-1 inline h-4 w-4 text-red-500" />
                                An error occurred. Please try again.
                              </div>
                            );
                          }
                          return null;
                        case 'tool-updateDocument':
                          if (part.state === 'input-available') {
                            return (
                              <p key={part.toolCallId}>Updating asset...</p>
                            );
                          } else if (
                            part.state === 'output-available' &&
                            part.output.id
                          ) {
                            return (
                              <DocumentToolResult
                                key={part.toolCallId}
                                result={part.output}
                              />
                            );
                          } else if (part.state === 'output-error') {
                            return (
                              <div key={part.toolCallId}>
                                <X className="mr-1 inline h-4 w-4 text-red-500" />
                                An error occurred. Please try again.
                              </div>
                            );
                          }
                          return null;
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>

                  <MessageAvatar
                    src={
                      message.role === 'user'
                        ? 'https://github.com/shadcn.png'
                        : ''
                    }
                    name="AI"
                  />
                </Message>
                {message.role === 'assistant' && (
                  <Actions className="ml-10 inline-flex">
                    {(() => {
                      const vote = votes?.find(
                        vote => vote.messageId === message.id,
                      );
                      return (
                        <>
                          <Action
                            label="Like"
                            disabled={vote?.isUpvote === true}
                            onClick={async () => {
                              const upvote = fetch('/api/vote', {
                                method: 'PATCH',
                                body: JSON.stringify({
                                  chatId,
                                  messageId: message.id,
                                  type: 'up',
                                }),
                              });

                              toast.promise(upvote, {
                                loading: 'Upvoting Response...',
                                success: () => {
                                  void mutate<Array<Vote>>(
                                    `/api/vote?chatId=${chatId}`,
                                    currentVotes => {
                                      if (!currentVotes)
                                        return [
                                          {
                                            chatId,
                                            messageId: message.id,
                                            isUpvote: true,
                                          },
                                        ];

                                      const votesWithoutCurrent =
                                        currentVotes.filter(
                                          vote => vote.messageId !== message.id,
                                        );

                                      return [
                                        ...votesWithoutCurrent,
                                        {
                                          chatId,
                                          messageId: message.id,
                                          isUpvote: true,
                                        },
                                      ];
                                    },
                                    { revalidate: false },
                                  );

                                  return 'Upvoted Response!';
                                },
                                error: 'Failed to upvote response.',
                              });
                            }}
                          >
                            <ThumbsUp className="h-5 w-5 md:h-4 md:w-4" />
                          </Action>
                          <Action
                            label="Dislike"
                            disabled={vote?.isUpvote === false}
                            onClick={async () => {
                              const downvote = fetch('/api/vote', {
                                method: 'PATCH',
                                body: JSON.stringify({
                                  chatId,
                                  messageId: message.id,
                                  type: 'down',
                                }),
                              });

                              toast.promise(downvote, {
                                loading: 'Downvoting Response...',
                                success: () => {
                                  void mutate<Array<Vote>>(
                                    `/api/vote?chatId=${chatId}`,
                                    currentVotes => {
                                      if (!currentVotes)
                                        return [
                                          {
                                            chatId,
                                            messageId: message.id,
                                            isUpvote: false,
                                          },
                                        ];

                                      const votesWithoutCurrent =
                                        currentVotes.filter(
                                          vote => vote.messageId !== message.id,
                                        );

                                      return [
                                        ...votesWithoutCurrent,
                                        {
                                          chatId,
                                          messageId: message.id,
                                          isUpvote: false,
                                        },
                                      ];
                                    },
                                    { revalidate: false },
                                  );

                                  return 'Downvoted Response!';
                                },
                                error: 'Failed to downvote response.',
                              });
                            }}
                          >
                            <ThumbsDown className="h-5 w-5 md:h-4 md:w-4" />
                          </Action>
                        </>
                      );
                    })()}
                  </Actions>
                )}
              </div>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="flex-shrink-0 p-2">
        {!selectedDocument?.stlUrl && (
          <Suggestions className="mb-2">
            {suggestions.map(suggestion => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
        )}

        <PromptInput onSubmit={handleSubmit} className="max-w-3xl">
          <PromptInputTextarea
            onChange={e => setText(e.target.value)}
            value={text}
          />
          <Separator />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton>
                <MicIcon className="h-5 w-5 md:h-4 md:w-4" />
              </PromptInputButton>
              <ModelSelector />
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
