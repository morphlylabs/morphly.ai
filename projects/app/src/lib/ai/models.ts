export const SUPPORTED_MODELS = [
  'anthropic/claude-sonnet-4.5',
  'openai/gpt-5.2',
] as const;

export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

export const MODEL_DISPLAY_NAME: Record<SupportedModel, string> = {
  'anthropic/claude-sonnet-4.5': 'Claude Sonnet 4.5',
  'openai/gpt-5.2': 'GPT-5.2',
};

export const MODEL_BILLING_NAME: Record<SupportedModel, string> = {
  'anthropic/claude-sonnet-4.5': 'claude-sonnet-4-5-uses',
  'openai/gpt-5.2': 'gpt-5-2-uses',
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
