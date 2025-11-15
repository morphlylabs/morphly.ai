import z from 'zod';

export const RECENT_CHATS_LIMIT = 3;
export const DEFAULT_CHATS_LIMIT = 9;
export const MAX_CHATS_LIMIT = 50;

export const offsetSchema = z.coerce.number().int().min(0).default(0);
export const limitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(MAX_CHATS_LIMIT)
  .default(DEFAULT_CHATS_LIMIT);

export const chatsParamsSchema = z.object({
  offset: offsetSchema,
  limit: limitSchema,
});
