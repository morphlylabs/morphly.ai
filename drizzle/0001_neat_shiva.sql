CREATE TABLE `stream` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`chat_id` text(36) NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_message` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`chat_id` text(36) NOT NULL,
	`created_at` integer NOT NULL,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_message`("id", "chat_id", "created_at", "role", "parts") SELECT "id", "chat_id", "created_at", "role", "parts" FROM `message`;--> statement-breakpoint
DROP TABLE `message`;--> statement-breakpoint
ALTER TABLE `__new_message` RENAME TO `message`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_chat` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text(36),
	`title` text(128) NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_chat`("id", "user_id", "title", "created_at") SELECT "id", "user_id", "title", "created_at" FROM `chat`;--> statement-breakpoint
DROP TABLE `chat`;--> statement-breakpoint
ALTER TABLE `__new_chat` RENAME TO `chat`;