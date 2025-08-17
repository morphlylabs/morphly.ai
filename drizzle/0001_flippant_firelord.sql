PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_vote` (
	`chat_id` text(36) NOT NULL,
	`message_id` text(36) NOT NULL,
	`is_upvote` integer NOT NULL,
	PRIMARY KEY(`chat_id`, `message_id`),
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_vote`("chat_id", "message_id", "is_upvote") SELECT "chat_id", "message_id", "is_upvote" FROM `vote`;--> statement-breakpoint
DROP TABLE `vote`;--> statement-breakpoint
ALTER TABLE `__new_vote` RENAME TO `vote`;--> statement-breakpoint
PRAGMA foreign_keys=ON;