'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteChatButtonProps {
  chatId: string;
  chatTitle: string;
}

export function DeleteChatButton({ chatId, chatTitle }: DeleteChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete chat: ${errorText}`);
      }

      toast.success('Chat deleted successfully');
      setIsOpen(false);
      router.refresh(); // Refresh the page to update the chat list
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to the chat
    e.stopPropagation(); // Stop event bubbling
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="hover:bg-destructive/10 absolute top-2 right-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
        disabled={isDeleting}
      >
        <Trash2 className="text-destructive h-4 w-4" />
        <span className="sr-only">Delete chat</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{chatTitle}"? This will
              permanently remove the chat and all its messages. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
