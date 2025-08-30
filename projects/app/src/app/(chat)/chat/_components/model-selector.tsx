"use client";

import {
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from "~/components/ai-elements/prompt-input";
import { PromptInputModelSelect } from "~/components/ai-elements/prompt-input";
import { SUPPORTED_MODELS, toModelId } from "~/lib/ai/models";
import { toModelBillingName } from "~/lib/ai/models";
import { toModelDisplayName } from "~/lib/ai/models";
import { useCustomer } from "autumn-js/react";
import { useSelectedModel, useSetSelectedModel } from "../_stores/model.store";

export const ModelSelector = () => {
  const { check } = useCustomer();

  const model = useSelectedModel();
  const setModel = useSetSelectedModel();

  return (
    <PromptInputModelSelect
      onValueChange={(value) => {
        setModel(toModelId(value));
      }}
      value={model}
    >
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {SUPPORTED_MODELS.map((model) => (
          <PromptInputModelSelectItem
            key={model}
            value={model}
            disabled={
              check({
                featureId: toModelBillingName(model),
              }).data?.allowed === false
            }
          >
            {toModelDisplayName(model)}
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
};
