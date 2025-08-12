DROP TABLE `asset`;--> statement-breakpoint
ALTER TABLE `document` ADD `chat_id` text(36) NOT NULL REFERENCES chat(id);--> statement-breakpoint
ALTER TABLE `document` ADD `file_url` text;