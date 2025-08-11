import { getDocumentsById, createDocument } from '~/server/db/queries';
import { ChatSDKError } from '~/lib/errors';
import { auth } from '../../../../lib/auth';
import { postRequestBodySchema } from './schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameter id is missing',
    ).toResponse();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return new ChatSDKError('unauthorized:document').toResponse();
  }

  const documents = await getDocumentsById(id);

  const [document] = documents;

  if (!document) {
    return new ChatSDKError('not_found:document').toResponse();
  }

  if (document.userId !== session.user.id) {
    return new ChatSDKError('forbidden:document').toResponse();
  }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameter id is required.',
    ).toResponse();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return new ChatSDKError('not_found:document').toResponse();
  }

  const { content, title, kind } = postRequestBodySchema.parse(
    await request.json(),
  );

  const documents = await getDocumentsById(id);

  if (documents[0] && documents[0].userId !== session.user.id) {
    return new ChatSDKError('forbidden:document').toResponse();
  }

  const document = await createDocument({
    id,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  return Response.json(document, { status: 200 });
}
