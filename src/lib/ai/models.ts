export const SUPPORTED_MODELS = [
  'anthropic/claude-sonnet-4',
  'meta/llama-4-maverick',
] as const;

export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

export const MODEL_DISPLAY_NAME: Record<SupportedModel, string> = {
  'anthropic/claude-sonnet-4': 'Claude Sonnet 4',
  'meta/llama-4-maverick': 'Llama 4 Maverick',
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
