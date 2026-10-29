ALTER TABLE "membership_applications" ADD COLUMN "welcome_email_sent_at" timestamp with time zone;--> statement-breakpoint
-- Members who registered before this migration were never sent the welcome email; mark them done so a repeated gateway response does not send one now.
UPDATE "membership_applications" SET "welcome_email_sent_at" = "paid_at" WHERE "status" = 'paid';--> statement-breakpoint
-- Who is copied on registration emails; editable under Settings › Email settings in the admin panel.
INSERT INTO "site_content" ("key", "data") VALUES ('settings.emails', '{"registrationCc": "ocacentre@gmail.com"}'::jsonb) ON CONFLICT ("key") DO NOTHING;
