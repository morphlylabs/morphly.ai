import { memo, useEffect, useState } from 'react';
import type { ArtifactKind } from '~/lib/artifacts/server';
import { Button } from './ui/button';
import { CheckIcon } from 'lucide-react';
import { useChatStore, useDocumentById } from '../stores/chat.store';

interface DocumentToolResultProps {
  result: { id: string; title: string; kind: ArtifactKind; content: string };
}

function PureDocumentToolResult({ result }: DocumentToolResultProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const document = useDocumentById(result.id);
  const {
    setSelectedDocumentId,
    selectedDocumentId,
    executeDocumentCodeAndPopulateUrl,
  } = useChatStore();

  useEffect(() => {
    if (!isGenerating && document?.content && !document.fileUrl) {
      void executeDocumentCodeAndPopulateUrl(document.id);
    }
    setIsGenerating(document?.fileUrl === undefined);
  }, [document, executeDocumentCodeAndPopulateUrl, isGenerating]);

  return (
    <div>
      <p className="mb-2">New version available: {result.title}</p>
      {isGenerating && <p>Generating...</p>}
      {result.kind === 'code' && document?.fileUrl && !isGenerating && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDocumentId(document.id)}
          disabled={selectedDocumentId === document.id}
        >
          Select Version
          {selectedDocumentId === document.id && (
            <CheckIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

export const DocumentToolResult = memo(PureDocumentToolResult, () => true);
