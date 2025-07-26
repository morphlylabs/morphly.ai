import { formatDistance } from "date-fns";
import {
  useCallback,
  useEffect,
  useState,
  memo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { codeArtifact } from "~/artifacts/code/client";
import type { ChatMessage } from "../lib/types";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useArtifact } from "../hooks/use-artifact";
import useSWR, { useSWRConfig } from "swr";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";
import equal from "fast-deep-equal";
import { ChatInput } from "./chat-input";
import type { Document } from "~/server/db/schema";
import { ArtifactMessages } from "~/components/artifact-messages";
import { fetcher } from "../lib/utils";

export const artifactDefinitions = [codeArtifact];
export type ArtifactKind = "code";

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

function PureArtifact({
  chatId,
  input,
  setInput,
  status,
  stop,
  sendMessage,
  messages,
  setMessages,
  regenerate,
}: {
  chatId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  status: UseChatHelpers<ChatMessage>["status"];
  stop: UseChatHelpers<ChatMessage>["stop"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
}) {
  const { artifact, setArtifact, metadata, setMetadata } = useArtifact();

  const {
    data: documents,
    isLoading: isDocumentsFetching,
    mutate: mutateDocuments,
  } = useSWR<Array<Document>>(
    artifact.documentId !== "init" && artifact.status !== "streaming"
      ? `/api/document?id=${artifact.documentId}`
      : null,
    fetcher,
  );

  const [mode, setMode] = useState<"edit" | "diff">("edit");
  const [document, setDocument] = useState<Document | null>(null);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);

  useEffect(() => {
    if (documents && documents.length > 0) {
      const mostRecentDocument = documents.at(-1);

      if (mostRecentDocument) {
        setDocument(mostRecentDocument);
        setCurrentVersionIndex(documents.length - 1);
        setArtifact((currentArtifact) => ({
          ...currentArtifact,
          content: mostRecentDocument.content ?? "",
        }));
      }
    }
  }, [documents, setArtifact]);

  useEffect(() => {
    void mutateDocuments();
  }, [artifact.status, mutateDocuments]);

  const { mutate } = useSWRConfig();
  const [isContentDirty, setIsContentDirty] = useState(false);

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!artifact) return;

      void mutate<Array<Document>>(
        `/api/document?id=${artifact.documentId}`,
        async (currentDocuments) => {
          if (!currentDocuments) return undefined;

          const currentDocument = currentDocuments.at(-1);

          if (!currentDocument?.content) {
            setIsContentDirty(false);
            return currentDocuments;
          }

          if (currentDocument.content !== updatedContent) {
            await fetch(`/api/document?id=${artifact.documentId}`, {
              method: "POST",
              body: JSON.stringify({
                title: artifact.title,
                content: updatedContent,
                kind: artifact.kind,
              }),
            });

            setIsContentDirty(false);

            const newDocument = {
              ...currentDocument,
              content: updatedContent,
              createdAt: new Date(),
            };

            return [...currentDocuments, newDocument];
          }
          return currentDocuments;
        },
        { revalidate: false },
      );
    },
    [artifact, mutate],
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    2000,
  );

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      if (document && updatedContent !== document.content) {
        setIsContentDirty(true);

        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      }
    },
    [document, debouncedHandleContentChange, handleContentChange],
  );

  function getDocumentContentById(index: number) {
    if (!documents) return "";
    if (!documents[index]) return "";
    return documents[index].content ?? "";
  }

  /*
   * NOTE: if there are no documents, or if
   * the documents are being fetched, then
   * we mark it as the current version.
   */

  const isCurrentVersion =
    documents && documents.length > 0
      ? currentVersionIndex === documents.length - 1
      : true;

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind,
  );

  if (!artifactDefinition) {
    throw new Error("Artifact definition not found!");
  }

  useEffect(() => {
    if (artifact.documentId !== "init") {
      if (artifactDefinition.initialize) {
        artifactDefinition.initialize({
          documentId: artifact.documentId,
          setMetadata: (value) => {
            void setMetadata(value);
          },
        });
      }
    }
  }, [artifact.documentId, artifactDefinition, setMetadata]);

  return (
    <div>
      {artifact.isVisible && (
        <div
          data-testid="artifact"
          className="fixed top-0 left-0 z-50 flex h-dvh w-dvw flex-row bg-transparent"
        >
          {!isMobile && (
            <div
              className="bg-background fixed h-dvh"
              style={{
                width: windowWidth,
                right: 0,
              }}
            />
          )}

          {!isMobile && (
            <div className="bg-muted dark:bg-background relative h-dvh w-[400px] shrink-0">
              {!isCurrentVersion && (
                <div className="absolute top-0 left-0 z-50 h-dvh w-[400px] bg-zinc-900/50" />
              )}

              <div className="flex h-full flex-col items-center justify-between">
                <ArtifactMessages
                  chatId={chatId}
                  status={status}
                  messages={messages}
                  setMessages={setMessages}
                  regenerate={regenerate}
                  artifactStatus={artifact.status}
                />

                <form className="relative flex w-full flex-row items-end gap-2 px-4 pb-4">
                  <ChatInput
                    chatId={chatId}
                    input={input}
                    setInput={setInput}
                    status={status}
                    stop={stop}
                    sendMessage={sendMessage}
                    className="bg-background dark:bg-muted"
                    setMessages={setMessages}
                  />
                </form>
              </div>
            </div>
          )}

          <div
            className="dark:bg-muted bg-background fixed flex h-dvh flex-col overflow-y-scroll border-zinc-200 md:border-l dark:border-zinc-700"
            style={
              isMobile
                ? {
                    left: 0,
                    top: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : "100dvw",
                  }
                : {
                    left: 400,
                    top: 0,
                    height: windowHeight,
                    width: windowWidth
                      ? windowWidth - 400
                      : "calc(100dvw-400px)",
                  }
            }
          >
            <div className="flex flex-row items-start justify-between p-2">
              <div className="flex flex-row items-start gap-4">
                <div className="flex flex-col">
                  <div className="font-medium">{artifact.title}</div>

                  {isContentDirty ? (
                    <div className="text-muted-foreground text-sm">
                      Saving changes...
                    </div>
                  ) : document ? (
                    <div className="text-muted-foreground text-sm">
                      {`Updated ${formatDistance(
                        new Date(document.createdAt),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}`}
                    </div>
                  ) : (
                    <div className="bg-muted-foreground/20 mt-2 h-3 w-32 animate-pulse rounded-md" />
                  )}
                </div>
              </div>
            </div>

            <div className="dark:bg-muted bg-background h-full !max-w-full items-center overflow-y-scroll">
              <artifactDefinition.content
                title={artifact.title}
                content={
                  isCurrentVersion
                    ? artifact.content
                    : getDocumentContentById(currentVersionIndex)
                }
                mode={mode}
                status={artifact.status}
                currentVersionIndex={currentVersionIndex}
                onSaveContent={saveContent}
                isInline={false}
                isCurrentVersion={isCurrentVersion}
                getDocumentContentById={getDocumentContentById}
                isLoading={isDocumentsFetching && !artifact.content}
                metadata={metadata}
                setMetadata={setMetadata}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Artifact = memo(PureArtifact, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (!equal(prevProps.messages, nextProps.messages.length)) return false;

  return true;
});
