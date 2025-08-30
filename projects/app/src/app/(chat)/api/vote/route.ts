import { getSession } from "@/lib/auth";
import { ChatSDKError } from "@/lib/errors";
import {
  createOrUpdateVote,
  getChatById,
  getVotesByChatId,
} from "@/server/db/queries";
import { voteSchema } from "./schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId is required.",
    ).toResponse();
  }

  const session = await getSession();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:vote").toResponse();
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:vote").toResponse();
  }

  const votes = await getVotesByChatId(chatId);

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const parsed = voteSchema.safeParse(await request.json());

  if (!parsed.success) {
    return new ChatSDKError(
      "bad_request:api",
      parsed.error.message,
    ).toResponse();
  }

  const { chatId, messageId, type } = parsed.data;

  const session = await getSession();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:vote").toResponse();
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    return new ChatSDKError("not_found:vote").toResponse();
  }

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:vote").toResponse();
  }

  if (!chat.messages.some((message) => message.id === messageId)) {
    return new ChatSDKError(
      "forbidden:vote",
      "Message does not belong to this chat",
    ).toResponse();
  }

  await createOrUpdateVote({
    chatId,
    messageId,
    type: type,
  });

  return new Response("Message voted", { status: 200 });
}
