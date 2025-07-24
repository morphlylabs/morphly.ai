import { relations, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const parametricModel = sqliteTable("parametric_model", {
  id: text("id", { length: 36 }).primaryKey(),
  messageId: text("message_id")
    .notNull()
    .references(() => message.id),
  code: text("code").notNull(),
  language: text("language", { enum: ["cadquery"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type ParametricModel = InferSelectModel<typeof parametricModel>;

export const parametricModelRelations = relations(
  parametricModel,
  ({ one, many }) => ({
    message: one(message, {
      fields: [parametricModel.messageId],
      references: [message.id],
    }),
    stl_file: many(stlFile),
  }),
);

export const stlFile = sqliteTable("stl_file", {
  id: text("id", { length: 36 }).primaryKey(),
  modelId: text("model_id").references(() => parametricModel.id),
  url: text("url").notNull(),
  size: integer("size", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const stlFileRelations = relations(stlFile, ({ one }) => ({
  model: one(parametricModel, {
    fields: [stlFile.modelId],
    references: [parametricModel.id],
  }),
}));

export const chat = sqliteTable("chat", {
  id: text("id", { length: 36 }).primaryKey(),
  userId: text("user_id", { length: 36 }).references(() => user.id),
  title: text("title", { length: 128 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Chat = InferSelectModel<typeof chat>;

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message),
  stream: many(stream),
}));

export const message = sqliteTable("message", {
  id: text("id", { length: 36 }).primaryKey(),
  chatId: text("chat_id", { length: 36 })
    .notNull()
    .references(() => chat.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  parts: text("parts", { mode: "json" }).notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const messageRelations = relations(message, ({ one, many }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
  models: many(parametricModel),
}));

export const stream = sqliteTable("stream", {
  id: text("id", { length: 36 }).primaryKey(),
  chatId: text("chat_id", { length: 36 })
    .notNull()
    .references(() => chat.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const streamRelations = relations(stream, ({ one }) => ({
  chat: one(chat, {
    fields: [stream.chatId],
    references: [chat.id],
  }),
}));
