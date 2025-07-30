import { memo, useEffect, useState } from "react";
import type { ArtifactKind } from "./artifact";
import { findStlAssetByDocumentId } from "~/app/(chat)/actions";
import { Button } from "./ui/button";
import type { Asset } from "../server/db/schema";
import { useAssetSelection } from "./chat";
import { CheckIcon } from "lucide-react";

interface DocumentToolResultProps {
  result: { id: string; title: string; kind: ArtifactKind };
}

function PureDocumentToolResult({ result }: DocumentToolResultProps) {
  const [stlAsset, setStlAsset] = useState<Asset | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { selectedAsset, setSelectedAsset } = useAssetSelection();

  useEffect(() => {
    if (result.kind === "code") {
      setLoading(true);
      findStlAssetByDocumentId(result.id)
        .then(setStlAsset)
        .catch(() => setStlAsset(undefined))
        .finally(() => setLoading(false));
    }
  }, [result.id, result.kind]);

  return (
    <div>
      <p className="mb-2">New version available: {result.title}</p>
      {result.kind === "code" && stlAsset && !loading && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedAsset(stlAsset)}
          disabled={selectedAsset?.id === stlAsset.id}
        >
          Select Version
          {selectedAsset?.id === stlAsset.id && (
            <CheckIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

export const DocumentToolResult = memo(PureDocumentToolResult, () => true);
