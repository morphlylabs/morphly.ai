"use client";

import React, { memo } from "react";

type EditorProps = {
  content: string;
  status: "streaming" | "idle";
};

function PureCodeViewer({ content, status }: EditorProps) {
  return (
    <div className="not-prose relative w-full pb-[calc(80dvh)] text-sm">
      <div className="h-full overflow-auto rounded-lg border border-gray-700 bg-gray-900">
        <pre className="h-full overflow-auto p-4 text-sm leading-relaxed text-gray-100">
          <code className="block font-mono break-words whitespace-pre-wrap">
            {content || "# Your code will appear here..."}
          </code>
        </pre>
      </div>
      {status === "streaming" && (
        <div className="absolute right-4 bottom-4">
          <div className="flex items-center space-x-2 rounded-md bg-blue-600 px-3 py-1 text-xs text-white">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span>Generating...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  if (prevProps.status === "streaming" && nextProps.status === "streaming")
    return false;
  if (prevProps.content !== nextProps.content) return false;

  return true;
}

export const CodeViewer = memo(PureCodeViewer, areEqual);
