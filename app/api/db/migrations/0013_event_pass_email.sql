ALTER TABLE "event_pass_bookings" ADD COLUMN "pass_email_sent_at" timestamp with time zone;--> statement-breakpoint
-- Passes paid before this migration (and those imported from the old site, some without paid_at) were emailed or handed out already; mark them done so the payment check does not send them again.
UPDATE "event_pass_bookings" SET "pass_email_sent_at" = COALESCE("paid_at", "updated_at") WHERE "status" = 'paid';
