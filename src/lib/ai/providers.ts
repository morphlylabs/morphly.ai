import { customProvider } from 'ai';
import { groq } from '@ai-sdk/groq';
import type { LanguageModelV2 } from '@ai-sdk/provider';

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ??
    process.env.PLAYWRIGHT ??
    process.env.CI_PLAYWRIGHT,
);

let testLanguageModels: Record<string, LanguageModelV2> | undefined;

if (isTestEnvironment) {
  const { chatModel, reasoningModel, titleModel, artifactModel } = await import(
    '../../../tests/ai/models'
  );
  testLanguageModels = {
    'chat-model': chatModel,
    'chat-model-reasoning': reasoningModel,
    'title-model': titleModel,
    'artifact-model': artifactModel,
  };
}

export const myProvider = customProvider({
  languageModels: isTestEnvironment
    ? testLanguageModels
    : {
        'chat-model': groq('meta-llama/llama-4-maverick-17b-128e-instruct'),
        'chat-model-reasoning': groq(
          'meta-llama/llama-4-maverick-17b-128e-instruct',
        ),
        'title-model': groq('openai/gpt-oss-20b'),
        'artifact-model': groq('meta-llama/llama-4-maverick-17b-128e-instruct'),
      },
});
