import { Button } from '@workspace/ui/components/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@workspace/ui/components/tooltip';
import { Code, Box, Footprints } from 'lucide-react';
import { useSelectedDocument } from '@/stores/chat.store';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';
import { downloadFileFromUrl } from '@/lib/utils';

export default function AssetActions() {
  const selectedDocument = useSelectedDocument();
  const [, copy] = useCopyToClipboard();

  const copyCode = async () => {
    if (selectedDocument?.content) {
      try {
        await copy(selectedDocument.content);
        toast.success('Code copied to clipboard');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to copy code';
        console.error('Failed to copy code:', errorMessage);
        toast.error('Failed to copy code to clipboard');
      }
    }
  };

  const downloadSTL = async () => {
    if (selectedDocument?.stlUrl) {
      try {
        const filename = `model.stl`;
        await downloadFileFromUrl(selectedDocument.stlUrl, filename);
        toast.success(`STL file downloaded successfully`);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to download STL file`;
        console.error(`Failed to download STL file:`, errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const downloadSTP = async () => {
    if (selectedDocument?.stpUrl) {
      try {
        const filename = `model.stp`;
        await downloadFileFromUrl(selectedDocument.stpUrl, filename);
        toast.success(`STP file downloaded successfully`);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to download STP file`;
        console.error(`Failed to download STP file:`, errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="bg-background h-12 w-12 md:h-8 md:w-8"
            aria-label="Copy code"
            onClick={copyCode}
          >
            <Code className="h-6 w-6 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Copy code</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="bg-background h-12 w-12 md:h-8 md:w-8"
            aria-label="Download STL"
            onClick={downloadSTL}
          >
            <Box className="h-6 w-6 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Download STL</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="bg-background h-12 w-12 md:h-8 md:w-8"
            aria-label="Download STP"
            onClick={downloadSTP}
          >
            <Footprints className="h-6 w-6 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Download STP</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
