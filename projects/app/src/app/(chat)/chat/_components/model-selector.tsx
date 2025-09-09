'use client';

import {
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from '@/components/ai-elements/prompt-input';
import { PromptInputModelSelect } from '@/components/ai-elements/prompt-input';
import { SUPPORTED_MODELS, toModelId } from '@/lib/ai/models';
import { toModelDisplayName } from '@/lib/ai/models';
import { useSelectedModel, useSetSelectedModel } from '@/stores/model.store';
import { Sparkles } from 'lucide-react';
import CheckoutDialog from '@/components/autumn/checkout-dialog';
import { useCustomer } from 'autumn-js/react';
import { Button } from '@workspace/ui/components/button';
import { useSubscriptionAccess } from '@/hooks/use-subscription-access';

export const ModelSelector = () => {
  const selectedModel = useSelectedModel();
  const setModel = useSetSelectedModel();
  const hasAccess = useSubscriptionAccess();
  const { checkout } = useCustomer();

  return (
    <div className="flex items-center gap-2">
      <PromptInputModelSelect
        onValueChange={value => {
          setModel(toModelId(value));
        }}
        value={selectedModel}
      >
        <PromptInputModelSelectTrigger>
          <PromptInputModelSelectValue />
        </PromptInputModelSelectTrigger>
        <PromptInputModelSelectContent>
          {SUPPORTED_MODELS.map(model => (
            <PromptInputModelSelectItem
              key={model}
              value={model}
              disabled={!hasAccess}
            >
              {toModelDisplayName(model)}
            </PromptInputModelSelectItem>
          ))}
        </PromptInputModelSelectContent>
      </PromptInputModelSelect>

      {!hasAccess && (
        <Button
          onClick={async () => {
            await checkout({
              productId: 'plus',
              dialog: CheckoutDialog,
            });
          }}
          size="sm"
          variant="outline"
        >
          <Sparkles className="h-3 w-3 text-violet-500" />
          Upgrade to use
        </Button>
      )}
    </div>
  );
};
