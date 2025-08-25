import { z } from 'zod';
import { SUPPORTED_MODELS } from '~/lib/ai/models';

const textPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000),
});

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  model: z.enum(SUPPORTED_MODELS),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(['user']),
    parts: z.array(textPartSchema),
  }),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
