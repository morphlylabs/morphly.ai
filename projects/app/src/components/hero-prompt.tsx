'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { Loader } from '@/components/ai-elements/loader';
import { v4 } from 'uuid';
import { useSelectedModel } from '@/stores/model.store';

export function HeroPrompt() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const selectedModel = useSelectedModel();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chatId = v4();
    const messageId = v4();
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: chatId,
          message: {
            parts: [
              {
                type: 'text',
                text: text,
              },
            ],
            id: messageId,
            role: 'user',
          },
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setText('');
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('An error occurred during chat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          What would you like to create today?
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe your idea and watch it come to life in 3D
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
        {/* TODO: add a view transition */}
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe what you want to create..."
          className="py-6 pr-12 text-lg shadow-lg"
          disabled={isLoading}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
          {isLoading ? (
            <div className="flex h-8 w-8 items-center justify-center">
              <Loader size={16} className="text-primary" />
            </div>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 rounded-md transition-transform hover:scale-110"
              disabled={!text.trim()}
              aria-label="Generate"
              title="Generate"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
