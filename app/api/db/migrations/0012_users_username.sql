ALTER TABLE "users" ADD COLUMN "username" varchar(100);--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");