import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { getDocumentById } from '@/server/db/queries';
import type { ChatMessage } from '@/lib/types';
import type { Session } from '@/lib/auth';
import { codeDocumentHandler } from '../../../artifacts/code/server';

interface UpdateDocumentProps {
  session: Session;
  model: string;
  dataStream: UIMessageStreamWriter<ChatMessage>;
}

export const updateDocument = ({
  session,
  model,
  dataStream,
}: UpdateDocumentProps) =>
  tool({
    description: 'Update a document with the given description.',
    inputSchema: z.object({
      id: z.string().describe('The ID of the document to update'),
      description: z
        .string()
        .describe('The description of changes that need to be made'),
    }),
    execute: async ({ id, description }) => {
      const document = await getDocumentById(id);

      if (!document) {
        return {
          error: 'Document not found',
        };
      }

      dataStream.write({
        type: 'data-clear',
        data: null,
        transient: true,
      });

      const documentHandler = codeDocumentHandler;

      const newDocument = await documentHandler.onUpdateDocument({
        document,
        description,
        model,
        dataStream,
        session,
      });

      dataStream.write({
        type: 'data-finish',
        data: newDocument,
        transient: true,
      });

      return {
        id: newDocument.id,
        title: newDocument.title,
        kind: newDocument.kind,
        content: 'The document has been updated successfully.',
      };
    },
  });
