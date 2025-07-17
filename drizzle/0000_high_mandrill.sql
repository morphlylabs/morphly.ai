CREATE TABLE `client_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	`url` text(256) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `client_models` (`name`);