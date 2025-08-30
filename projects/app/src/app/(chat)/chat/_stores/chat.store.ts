import "client-only";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { Document } from "~/server/db/schema";
import type { DataUIPart } from "ai";
import type { CustomUIDataTypes } from "~/lib/types";
import type { ArtifactKind } from "~/lib/artifacts/server";

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: "streaming" | "idle";
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export const initialArtifactData: UIArtifact = {
  documentId: "init",
  content: "",
  kind: "code",
  title: "",
  status: "idle",
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

interface ChatState {
  chatId: string | undefined;
  documents: Record<string, Document>;
  selectedDocumentId: string | undefined;
  // Data stream state
  dataStream: DataUIPart<CustomUIDataTypes>[];
}

interface ChatActions {
  setSelectedDocumentId: (documentId: string) => void;
  setChatId: (chatId: string) => void;
  setDocuments: (documents: readonly Document[]) => void;
  setDocument: (document: Document) => void;
  // Data stream actions
  setDataStream: (dataStream: DataUIPart<CustomUIDataTypes>[]) => void;
  addToDataStream: (dataPart: DataUIPart<CustomUIDataTypes>) => void;
  clearDataStream: () => void;
  processDataStreamUpdate: (dataPart: DataUIPart<CustomUIDataTypes>) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  chatId: undefined,
  documents: {},
  selectedDocumentId: undefined,
  dataStream: [],

  setSelectedDocumentId: (documentId: string) =>
    set({ selectedDocumentId: documentId }),
  setChatId: (chatId: string) => set({ chatId }),
  setDocuments: (documents: readonly Document[]) =>
    set({
      documents: documents.reduce<Record<string, Document>>((acc, document) => {
        acc[document.id] = document;
        return acc;
      }, {}),
      selectedDocumentId: documents.at(-1)?.id,
    }),
  setDocument: (document: Document) => {
    set({
      documents: {
        ...get().documents,
        [document.id]: document,
      },
      selectedDocumentId: document.id,
    });
  },

  // Data stream actions
  setDataStream: (dataStream: DataUIPart<CustomUIDataTypes>[]) =>
    set({ dataStream }),
  addToDataStream: (dataPart: DataUIPart<CustomUIDataTypes>) =>
    set((state) => ({ dataStream: [...state.dataStream, dataPart] })),
  clearDataStream: () => set({ dataStream: [] }),
  processDataStreamUpdate: (dataPart: DataUIPart<CustomUIDataTypes>) => {
    get().addToDataStream(dataPart);

    if (dataPart.type === "data-finish") {
      if (dataPart.data) {
        get().setDocument(dataPart.data);
      }
    }
  },
}));

export const useSelectedDocument = () =>
  useChatStore((state) =>
    state.selectedDocumentId
      ? state.documents[state.selectedDocumentId]
      : undefined,
  );

export const useDocumentById = (id: string) =>
  useChatStore((state) => state.documents[id]);

// Data stream selectors
export const useDataStream = () =>
  useChatStore(
    useShallow((state) => ({
      dataStream: state.dataStream,
      setDataStream: state.setDataStream,
      addToDataStream: state.addToDataStream,
      clearDataStream: state.clearDataStream,
      processDataStreamUpdate: state.processDataStreamUpdate,
    })),
  );
