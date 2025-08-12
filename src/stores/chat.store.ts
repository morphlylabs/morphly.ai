import { create } from 'zustand';
import type { Document } from '~/server/db/schema';
import { devtools } from 'zustand/middleware';
import { executeDocumentCodeAndPopulateUrl } from '../app/(chat)/actions';

interface ChatState {
  chatId: string | undefined;
  documents: Record<string, Document>;
  selectedDocumentId: string | undefined;
}

interface ChatActions {
  setSelectedDocumentId: (documentId: string) => void;
  setChatId: (chatId: string) => void;
  setDocuments: (documents: readonly Document[]) => void;
  executeDocumentCodeAndPopulateUrl: (documentId: string) => Promise<void>;
}

export const useChatStore = create<ChatState & ChatActions>()(
  devtools((set, get) => ({
    chatId: undefined,
    documents: {},
    selectedDocumentId: undefined,

    setSelectedDocumentId: (documentId: string) =>
      set({ selectedDocumentId: documentId }),
    setChatId: (chatId: string) => set({ chatId }),
    setDocuments: (documents: readonly Document[]) =>
      set({
        documents: documents.reduce<Record<string, Document>>(
          (acc, document) => {
            acc[document.id] = document;
            return acc;
          },
          {},
        ),
        selectedDocumentId: documents.at(-1)?.id,
      }),
    executeDocumentCodeAndPopulateUrl: async (documentId: string) => {
      const url = await executeDocumentCodeAndPopulateUrl(documentId);
      const document = get().documents[documentId];
      if (document) {
        set({
          documents: {
            ...get().documents,
            [documentId]: { ...document, fileUrl: url },
          },
        });
      }
    },
  })),
);

export const useSelectedDocument = () =>
  useChatStore(state =>
    state.selectedDocumentId
      ? state.documents[state.selectedDocumentId]
      : undefined,
  );

export const useDocumentById = (id: string) =>
  useChatStore(state => state.documents[id]);
