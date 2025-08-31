import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { artifactKinds } from '@/lib/artifacts/server';
import type { ChatMessage } from '@/lib/types';
import { v4 } from 'uuid';
import type { Session } from '@/lib/auth';
import { codeDocumentHandler } from '../../../artifacts/code/server';

interface CreateDocumentProps {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
  chatId: string;
  model: string;
}

export const createDocument = ({
  session,
  dataStream,
  chatId,
  model,
}: CreateDocumentProps) =>
  tool({
    description: 'Use this tool to create cadquery code.',
    inputSchema: z.object({
      title: z.string(),
      kind: z.enum(artifactKinds),
    }),
    execute: async ({ title, kind }) => {
      const id = v4();

      dataStream.write({
        type: 'data-kind',
        data: kind,
        transient: true,
      });

      dataStream.write({
        type: 'data-id',
        data: id,
        transient: true,
      });

      dataStream.write({
        type: 'data-title',
        data: title,
        transient: true,
      });

      dataStream.write({
        type: 'data-clear',
        data: null,
        transient: true,
      });

      const documentHandler = codeDocumentHandler;

      const document = await documentHandler.onCreateDocument({
        id,
        title,
        model,
        dataStream,
        session,
        chatId,
      });

      dataStream.write({
        type: 'data-finish',
        data: document,
        transient: true,
      });

      return {
        id,
        title,
        kind,
        content: 'A document was created and is now visible to the user.',
      };
    },
  });
