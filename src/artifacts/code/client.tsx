import { CodeViewer } from "~/components/code-viewer";
import { Artifact } from "~/components/create-artifact";

export const codeArtifact = new Artifact<"code">({
  kind: "code",
  description:
    "Useful for code generation; Code execution is only available for python code.",
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-codeDelta") {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.data,
        isVisible:
          draftArtifact.status === "streaming" &&
          draftArtifact.content.length > 300 &&
          draftArtifact.content.length < 310
            ? true
            : draftArtifact.isVisible,
        status: "streaming",
      }));
    }
  },
  content: ({ ...props }) => {
    return (
      <div className="px-1">
        <CodeViewer {...props} />
      </div>
    );
  },
  actions: [],
  toolbar: [],
});
