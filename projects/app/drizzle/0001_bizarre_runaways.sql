PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_document` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`chat_id` text(36) NOT NULL,
	`created_at` integer NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`kind` text DEFAULT 'code' NOT NULL,
	`user_id` text(36) NOT NULL,
	`stl_url` text,
	`stp_url` text,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_document`("id", "chat_id", "created_at", "title", "content", "kind", "user_id", "stl_url", "stp_url") SELECT "id", "chat_id", "created_at", "title", "content", "kind", "user_id", "stl_url", "stp_url" FROM `document`;--> statement-breakpoint
DROP TABLE `document`;--> statement-breakpoint
ALTER TABLE `__new_document` RENAME TO `document`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_message` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`chat_id` text(36) NOT NULL,
	`created_at` integer NOT NULL,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_message`("id", "chat_id", "created_at", "role", "parts") SELECT "id", "chat_id", "created_at", "role", "parts" FROM `message`;--> statement-breakpoint
DROP TABLE `message`;--> statement-breakpoint
ALTER TABLE `__new_message` RENAME TO `message`;--> statement-breakpoint
CREATE TABLE `__new_stream` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`chat_id` text(36) NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_stream`("id", "chat_id", "created_at") SELECT "id", "chat_id", "created_at" FROM `stream`;--> statement-breakpoint
DROP TABLE `stream`;--> statement-breakpoint
ALTER TABLE `__new_stream` RENAME TO `stream`;