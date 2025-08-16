import 'server-only';

import { relations, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// USERS
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// SESSIONS
export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

// ACCOUNTS
export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// VERIFICATIONS
export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// CHATS
export const chat = sqliteTable('chat', {
  id: text('id', { length: 36 }).primaryKey(),
  userId: text('user_id', { length: 36 })
    .notNull()
    .references(() => user.id),
  title: text('title', { length: 128 }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export type Chat = InferSelectModel<typeof chat>;
export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message),
  documents: many(document),
  stream: many(stream),
}));

// MESSAGES
export const message = sqliteTable('message', {
  id: text('id', { length: 36 }).primaryKey(),
  chatId: text('chat_id', { length: 36 })
    .notNull()
    .references(() => chat.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  parts: text('parts', { mode: 'json' }).notNull(),
});
export type Message = InferSelectModel<typeof message>;
export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
}));

// DOCUMENTS
export const document = sqliteTable('document', {
  id: text('id', { length: 36 }).primaryKey(),
  chatId: text('chat_id', { length: 36 })
    .notNull()
    .references(() => chat.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  title: text('title').notNull(),
  content: text('content'),
  kind: text('kind', { enum: ['code'] })
    .notNull()
    .default('code'),
  userId: text('user_id', { length: 36 })
    .notNull()
    .references(() => user.id),
  fileUrl: text('file_url'),
});
export type Document = InferSelectModel<typeof document>;
export const documentRelations = relations(document, ({ one }) => ({
  chat: one(chat, {
    fields: [document.chatId],
    references: [chat.id],
  }),
}));

// STREAMS
export const stream = sqliteTable('stream', {
  id: text('id', { length: 36 }).primaryKey(),
  chatId: text('chat_id', { length: 36 })
    .notNull()
    .references(() => chat.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export const streamRelations = relations(stream, ({ one }) => ({
  chat: one(chat, {
    fields: [stream.chatId],
    references: [chat.id],
  }),
}));
