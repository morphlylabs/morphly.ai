DROP INDEX "name_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `client_models` ALTER COLUMN "name" TO "name" text(256) NOT NULL;--> statement-breakpoint
CREATE INDEX `name_idx` ON `client_models` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `client_models` ADD `userId` text(256) REFERENCES user(id);