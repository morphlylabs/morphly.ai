import z from 'zod';

export const RECENT_CHATS_LIMIT = 3;
export const DEFAULT_CHATS_LIMIT = 9;

export const offsetSchema = z.coerce.number().int().min(0).default(0);
export const limitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .default(DEFAULT_CHATS_LIMIT);
