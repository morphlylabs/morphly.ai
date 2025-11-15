import type { ArtifactKind } from '@/lib/artifacts/server';
import { Button } from '@workspace/ui/components/button';
import { CheckIcon } from 'lucide-react';
import { useChatStore, useDocumentById } from '@/stores/chat.store';

interface DocumentToolResultProps {
  result: { id: string; title: string; kind: ArtifactKind; content: string };
}

export function DocumentToolResult({ result }: DocumentToolResultProps) {
  const document = useDocumentById(result.id);
  const { setSelectedDocumentId, selectedDocumentId } = useChatStore();

  return (
    <div>
      <p className="mb-2">New version available: {result.title}</p>
      {document?.stlUrl && (
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
