import { customProvider } from 'ai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from '../../../tests/ai/models';
import { groq } from '@ai-sdk/groq';

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ??
    process.env.PLAYWRIGHT ??
    process.env.CI_PLAYWRIGHT,
);

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': groq('meta-llama/llama-4-maverick-17b-128e-instruct'),
        'title-model': groq('meta-llama/llama-4-maverick-17b-128e-instruct'),
        'artifact-model': groq('meta-llama/llama-4-maverick-17b-128e-instruct'),
      },
    });
