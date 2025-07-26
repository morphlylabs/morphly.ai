CREATE TABLE `document` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`kind` text DEFAULT 'code' NOT NULL,
	`user_id` text(36) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `parametric_model`;--> statement-breakpoint
DROP TABLE `stl_file`;