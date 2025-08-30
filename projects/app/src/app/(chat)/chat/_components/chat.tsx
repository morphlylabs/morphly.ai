'use client';

import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from '@/stores/chat.store';
import { v4 } from 'uuid';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { toast } from 'sonner';
import Asset from './asset';
import { Button } from '@workspace/ui/components/button';
import {
	Box,
	Code,
	Footprints,
	MicIcon,
	ThumbsDown,
	ThumbsUp,
	X,
} from 'lucide-react';
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '@workspace/ui/components/tooltip';
import { useCopyToClipboard } from 'usehooks-ts';
import { downloadFileFromUrl, fetcher } from '@/lib/utils';
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
import { DocumentToolResult } from '@/components/document';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { Separator } from '@workspace/ui/components/separator';
import { useChatStore, useSelectedDocument } from '@/stores/chat.store';
import type { Document, Vote } from '@/server/db/schema';
import { Action, Actions } from '@/components/ai-elements/actions';
import useSWR, { mutate } from 'swr';
import { chatSDKErrorSchema } from '@/lib/errors';
import { ModelSelector } from './model-selector';
import { useSelectedModel } from '@/stores/model.store';

const suggestions = [
	'Create a lamp that has a base and a shade',
	'Design a comfortable chair with armrests and cushions',
	'Create a decorative vase with intricate patterns and textures',
	'Build a simple house with walls, roof, windows, and a door',
];

export function Chat({
	id,
	initialMessages,
	initialDocuments,
	autoResume,
}: {
	id: string;
	initialMessages: ChatMessage[];
	initialDocuments: Document[];
	autoResume: boolean;
}) {
	const { processDataStreamUpdate } = useDataStream();
	const { setChatId, setDocuments } = useChatStore();

	// Set initial documents when component loads
	useEffect(() => {
		setChatId(id);
		setDocuments(initialDocuments ?? []);
	}, [id, initialDocuments, setChatId, setDocuments]);

	const [text, setText] = useState<string>('');
	const model = useSelectedModel();
	const selectedDocument = useSelectedDocument();
	const [, copy] = useCopyToClipboard();

	const { messages, setMessages, sendMessage, status, resumeStream } =
		useChat<ChatMessage>({
			id,
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		void sendMessage(
			{ text: text },
			{
				body: {
					model: model,
				},
			}
		);
		setText('');
		window.history.replaceState({}, '', `/chat/${id}`);
	};

	const handleSuggestionClick = (suggestion: string) => {
		void sendMessage(
			{ text: suggestion },
			{
				body: {
					model: model,
				},
			}
		);
		setText('');
		window.history.replaceState({}, '', `/chat/${id}`);
	};

	const { data: votes } = useSWR<Array<Vote>>(
		messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
		fetcher
	);

	useAutoResume({
		autoResume,
		initialMessages,
		resumeStream,
		setMessages,
	});

	const copyCode = async () => {
		if (selectedDocument?.content) {
			try {
				await copy(selectedDocument.content);
				toast.success('Code copied to clipboard');
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to copy code';
				console.error('Failed to copy code:', errorMessage);
				toast.error('Failed to copy code to clipboard');
			}
		}
	};

	const downloadSTL = async () => {
		if (selectedDocument?.stlUrl) {
			try {
				const filename = `model.stl`;
				await downloadFileFromUrl(selectedDocument.stlUrl, filename);
				toast.success(`STL file downloaded successfully`);
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: `Failed to download STL file`;
				console.error(`Failed to download STL file:`, errorMessage);
				toast.error(errorMessage);
			}
		}
	};

	const downloadSTP = async () => {
		if (selectedDocument?.stpUrl) {
			try {
				const filename = `model.stp`;
				await downloadFileFromUrl(selectedDocument.stpUrl, filename);
				toast.success(`STP file downloaded successfully`);
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: `Failed to download STP file`;
				console.error(`Failed to download STP file:`, errorMessage);
				toast.error(errorMessage);
			}
		}
	};

	return (
		<div
			className={
				selectedDocument?.stlUrl
					? 'grid h-[calc(100vh-4rem)] grid-cols-4'
					: 'flex h-[calc(100vh-4rem)] justify-center'
			}
		>
			{selectedDocument?.stlUrl && (
				<div className="bg-accent relative col-span-3 h-full border-r">
					<Asset src={selectedDocument.stlUrl} />
					<div className="absolute top-2 right-2 z-10 flex gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="bg-background"
									aria-label="Copy code"
									onClick={copyCode}
								>
									<Code className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Copy code</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="bg-background"
									aria-label="Download STL"
									onClick={downloadSTL}
								>
									<Box className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Download STL</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="bg-background"
									aria-label="Download STP"
									onClick={downloadSTP}
								>
									<Footprints className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Download STP</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			)}
			<div
				className={`bg-background flex h-[calc(100vh-4rem)] max-w-3xl min-w-0 flex-col ${selectedDocument?.stlUrl ? 'col-span-1' : ''}`}
			>
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
												vote => vote.messageId === message.id
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
																	chatId: id,
																	messageId: message.id,
																	type: 'up',
																}),
															});

															toast.promise(upvote, {
																loading: 'Upvoting Response...',
																success: () => {
																	void mutate<Array<Vote>>(
																		`/api/vote?chatId=${id}`,
																		currentVotes => {
																			if (!currentVotes)
																				return [
																					{
																						chatId: id,
																						messageId: message.id,
																						isUpvote: true,
																					},
																				];

																			const votesWithoutCurrent =
																				currentVotes.filter(
																					vote => vote.messageId !== message.id
																				);

																			return [
																				...votesWithoutCurrent,
																				{
																					chatId: id,
																					messageId: message.id,
																					isUpvote: true,
																				},
																			];
																		},
																		{ revalidate: false }
																	);

																	return 'Upvoted Response!';
																},
																error: 'Failed to upvote response.',
															});
														}}
													>
														<ThumbsUp size={16} />
													</Action>
													<Action
														label="Dislike"
														disabled={vote?.isUpvote === false}
														onClick={async () => {
															const downvote = fetch('/api/vote', {
																method: 'PATCH',
																body: JSON.stringify({
																	chatId: id,
																	messageId: message.id,
																	type: 'down',
																}),
															});

															toast.promise(downvote, {
																loading: 'Downvoting Response...',
																success: () => {
																	void mutate<Array<Vote>>(
																		`/api/vote?chatId=${id}`,
																		currentVotes => {
																			if (!currentVotes)
																				return [
																					{
																						chatId: id,
																						messageId: message.id,
																						isUpvote: false,
																					},
																				];

																			const votesWithoutCurrent =
																				currentVotes.filter(
																					vote => vote.messageId !== message.id
																				);

																			return [
																				...votesWithoutCurrent,
																				{
																					chatId: id,
																					messageId: message.id,
																					isUpvote: false,
																				},
																			];
																		},
																		{ revalidate: false }
																	);

																	return 'Downvoted Response!';
																},
																error: 'Failed to downvote response.',
															});
														}}
													>
														<ThumbsDown size={16} />
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

				<div className="p-2">
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
									<MicIcon size={16} />
								</PromptInputButton>
								<ModelSelector />
							</PromptInputTools>
							<PromptInputSubmit disabled={!text} status={status} />
						</PromptInputToolbar>
					</PromptInput>
				</div>
			</div>
		</div>
	);
}
