import { z } from 'zod';

export const postRequestBodySchema = z.object({
  content: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(['code']),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
