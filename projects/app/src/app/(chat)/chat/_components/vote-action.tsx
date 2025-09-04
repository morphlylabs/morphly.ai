'use client';

import { Action } from '@/components/ai-elements/actions';
import type { Vote } from '@/server/db/schema';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { memo } from 'react';

function PureVoteAction({
  type,
  chatId,
  messageId,
  isUpvote,
}: {
  type: 'up' | 'down';
  chatId: string;
  messageId: string;
  isUpvote: boolean | null;
}) {
  const isDisabled = type === 'up' ? isUpvote === true : isUpvote === false;
  const voteValue = type === 'up';

  const handleClick = async () => {
    const request = fetch('/api/vote', {
      method: 'PATCH',
      body: JSON.stringify({
        chatId,
        messageId,
        type,
      }),
    });

    toast.promise(request, {
      loading: `${voteValue ? 'Upvoting' : 'Downvoting'} Response...`,
      success: () => {
        void mutate<Array<Vote>>(
          `/api/vote?chatId=${chatId}`,
          currentVotes => {
            if (!currentVotes)
              return [
                {
                  chatId,
                  messageId,
                  isUpvote: voteValue,
                },
              ];

            const votesWithoutCurrent = currentVotes.filter(
              vote => vote.messageId !== messageId,
            );

            return [
              ...votesWithoutCurrent,
              {
                chatId,
                messageId,
                isUpvote: voteValue,
              },
            ];
          },
          { revalidate: false },
        );

        return `${voteValue ? 'Upvoted' : 'Downvoted'} Response!`;
      },
      error: `Failed to ${voteValue ? 'upvote' : 'downvote'} response.`,
    });
  };

  return (
    <Action
      label={voteValue ? 'Upvote' : 'Downvote'}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {voteValue ? (
        <ThumbsUp className="h-5 w-5 md:h-4 md:w-4" />
      ) : (
        <ThumbsDown className="h-5 w-5 md:h-4 md:w-4" />
      )}
    </Action>
  );
}

export const VoteAction = memo(PureVoteAction, (prevProps, nextProps) => {
  if (prevProps.type !== nextProps.type) return false;
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.messageId !== nextProps.messageId) return false;
  if (prevProps.isUpvote !== nextProps.isUpvote) return false;

  return true;
});
