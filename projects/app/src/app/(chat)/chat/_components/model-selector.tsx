'use client';

import {
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from '@/components/ai-elements/prompt-input';
import { PromptInputModelSelect } from '@/components/ai-elements/prompt-input';
import { SUPPORTED_MODELS, toModelId } from '@/lib/ai/models';
import { toModelBillingName } from '@/lib/ai/models';
import { toModelDisplayName } from '@/lib/ai/models';
import { useSelectedModel, useSetSelectedModel } from '@/stores/model.store';
import { Sparkles } from 'lucide-react';
import CheckoutDialog from '@/components/autumn/checkout-dialog';
import { useSubscriptionAccess } from '@/hooks/use-subscription-access';
import { useCustomer } from 'autumn-js/react';
import { Button } from '@workspace/ui/components/button';

export const ModelSelector = () => {
  const selectedModel = useSelectedModel();
  const setModel = useSetSelectedModel();
  const hasSubscription = useSubscriptionAccess();
  const { check, checkout } = useCustomer();

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
              disabled={
                check({
                  featureId: toModelBillingName(model),
                }).data.allowed === false
              }
            >
              {toModelDisplayName(model)}
            </PromptInputModelSelectItem>
          ))}
        </PromptInputModelSelectContent>
      </PromptInputModelSelect>

      {!hasSubscription && (
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
