import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  streamText,
} from "ai";
import { getStreamContext } from "~/lib/stream-context";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { ChatSDKError } from "~/lib/errors";
import { getSession } from "~/lib/auth";
import {
  createMessages,
  createStream,
  createChat,
  getChatById,
  getMessagesByChatId,
} from "~/server/db/queries";
import { v4 } from "uuid";
import { convertToUIMessages } from "~/lib/utils";
import { createDocument } from "~/lib/ai/tools/create-document";
import { updateDocument } from "~/lib/ai/tools/update-document";
import { MODEL_BILLING_NAME } from "~/lib/ai/models";
import { generateTitleFromUserMessage } from "../../actions";
import { Autumn as autumn } from "autumn-js";

export const maxDuration = 60;

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    requestBody = postRequestBodySchema.parse(await request.json());
  } catch {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const session = await getSession();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const { data } = await autumn.check({
      customer_id: session.user.id,
      feature_id: MODEL_BILLING_NAME[requestBody.model],
    });

    if (!data?.allowed) {
      return new ChatSDKError("payment_required:chat").toResponse();
    }

    const chat = await getChatById(requestBody.id);

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: requestBody.message,
      });

      await createChat({
        id: requestBody.id,
        userId: session.user.id,
        title,
      });
    } else if (chat.userId !== session.user.id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    await createMessages({
      messages: [
        {
          id: requestBody.message.id,
          chatId: requestBody.id,
          parts: requestBody.message.parts,
          role: "user",
          createdAt: new Date(),
        },
      ],
    });

    const messagesFromDb = await getMessagesByChatId(requestBody.id);
    const uiMessages = convertToUIMessages(messagesFromDb);

    const streamId = v4();

    await createStream({ streamId, chatId: requestBody.id });

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: requestBody.model,
          messages: convertToModelMessages(uiMessages),
          experimental_activeTools: ["createDocument", "updateDocument"],
          tools: {
            createDocument: createDocument({
              session,
              model: requestBody.model,
              dataStream,
              chatId: requestBody.id,
            }),
            updateDocument: updateDocument({
              session,
              model: requestBody.model,
              dataStream,
            }),
          },
        });

        void result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          }),
        );
      },
      generateId: v4,
      onFinish: async ({ messages }) => {
        await createMessages({
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: message.parts,
            createdAt: new Date(),
            chatId: requestBody.id,
          })),
        });

        await autumn.track({
          customer_id: session.user.id,
          feature_id: MODEL_BILLING_NAME[requestBody.model],
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream()),
        ),
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
    console.error(error);

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    return new ChatSDKError("bad_request:database").toResponse();
  }
}
