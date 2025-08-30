export const SUPPORTED_MODELS = [
  'anthropic/claude-sonnet-4',
  'meta/llama-4-maverick',
] as const;

export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

export const MODEL_DISPLAY_NAME: Record<SupportedModel, string> = {
  'meta/llama-4-maverick': 'Llama 4 Maverick',
  'anthropic/claude-sonnet-4': 'Claude Sonnet 4',
};

export const MODEL_BILLING_NAME: Record<SupportedModel, string> = {
  'meta/llama-4-maverick': 'llama-4-maverick-uses',
  'anthropic/claude-sonnet-4': 'claude-4-sonnet-uses',
};

export const toModelId = (modelId: string) => {
  const model = SUPPORTED_MODELS.find(model => model === modelId);

  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }

  return model;
};

export const toModelDisplayName = (id: SupportedModel) =>
  MODEL_DISPLAY_NAME[id];

export const toModelBillingName = (id: SupportedModel) =>
  MODEL_BILLING_NAME[id];
