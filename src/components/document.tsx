import { memo, useEffect, useState } from "react";
import type { ArtifactKind } from "./artifact";
import { findStlAssetByDocumentId } from "~/app/(chat)/actions";
import { Button } from "./ui/button";
import type { Asset } from "../server/db/schema";
import { useAssetSelection } from "./chat";

interface DocumentToolResultProps {
  result: { id: string; title: string; kind: ArtifactKind };
}

function PureDocumentToolResult({ result }: DocumentToolResultProps) {
  const [stlAsset, setStlAsset] = useState<Asset | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { setSelectedAsset } = useAssetSelection();

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
        >
          Select Version
        </Button>
      )}
    </div>
  );
}

export const DocumentToolResult = memo(PureDocumentToolResult, () => true);
