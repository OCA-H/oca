CREATE TABLE "event_pass_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(30) NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"event_pass_id" integer NOT NULL,
	"pass_id" varchar(50) NOT NULL,
	"pass_label" varchar(200) NOT NULL,
	"user_id" integer NOT NULL,
	"member_id" varchar(50) NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(30),
	"spouse_name" varchar(150),
	"teachers" integer DEFAULT 0 NOT NULL,
	"children_under12" integer DEFAULT 0 NOT NULL,
	"children_above12" integer DEFAULT 0 NOT NULL,
	"line_items" jsonb NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"tracking_id" varchar(50),
	"bank_ref_no" varchar(100),
	"payment_mode" varchar(50),
	"gateway_status" varchar(30),
	"gateway_message" varchar(255),
	"gateway_response" jsonb,
	"oversold" boolean DEFAULT false NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "event_pass_bookings_order_id_unique" ON "event_pass_bookings" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "event_pass_bookings_user_id_idx" ON "event_pass_bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_pass_bookings_status_idx" ON "event_pass_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_pass_bookings_event_pass_idx" ON "event_pass_bookings" USING btree ("event_name","pass_id");