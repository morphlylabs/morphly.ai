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
import { X, MicIcon } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useDataStream, useSelectedDocument } from '@/stores/chat.store';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Actions } from '@/components/ai-elements/actions';
import { VoteAction } from './vote-action';
import type { Vote } from '@/server/db/schema';
import { fetcher } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { v4 } from 'uuid';
import { memo, useState } from 'react';
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

  const { data: votes } = useSWR<readonly Vote[]>(
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
    <div className="flex h-full max-w-4xl flex-col">
      <div className="flex-1 overflow-y-auto">
        <Conversation>
          <ConversationContent>
            {messages.map(message => (
              <MessageRow
                key={message.id}
                chatId={chatId}
                message={message}
                isUpvote={
                  votes?.find(vote => vote.messageId === message.id)
                    ?.isUpvote ?? null
                }
              />
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

        <PromptInput onSubmit={handleSubmit} className="max-w-4xl">
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

const PureMessageRow = ({
  chatId,
  message,
  isUpvote,
}: {
  chatId: string;
  message: ChatMessage;
  isUpvote: boolean | null;
}) => {
  return (
    <div className="group flex flex-col">
      <Message from={message.role}>
        <MessageContent>
          {message.parts.map(part => {
            switch (part.type) {
              case 'text':
                return <p key={part.text}>{part.text}</p>;
              case 'tool-createDocument':
                if (part.state === 'input-available') {
                  return <p key={part.toolCallId}>Generating asset...</p>;
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
                  return <p key={part.toolCallId}>Updating asset...</p>;
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
          src={message.role === 'user' ? 'https://github.com/shadcn.png' : ''}
          name={message.role === 'user' ? 'You' : 'AI'}
        />
      </Message>
      {message.role === 'assistant' && (
        <Actions className="ml-10 inline-flex">
          <VoteAction
            type="up"
            chatId={chatId}
            messageId={message.id}
            isUpvote={isUpvote}
          />
          <VoteAction
            type="down"
            chatId={chatId}
            messageId={message.id}
            isUpvote={isUpvote}
          />
        </Actions>
      )}
    </div>
  );
};

const MessageRow = memo(PureMessageRow, (prevProps, nextProps) => {
  if (prevProps.message !== nextProps.message) return false;
  if (prevProps.isUpvote !== nextProps.isUpvote) return false;
  if (prevProps.chatId !== nextProps.chatId) return false;

  return true;
});
