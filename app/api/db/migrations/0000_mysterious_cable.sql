CREATE TABLE "event_passes" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"pass_id" varchar(50) NOT NULL,
	"tier_group" varchar(50) NOT NULL,
	"tier_title" varchar(100) NOT NULL,
	"title" varchar(150) NOT NULL,
	"label" varchar(200) NOT NULL,
	"description" text,
	"batch_eligibility" varchar(100),
	"price" integer DEFAULT 0 NOT NULL,
	"original_price" integer,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"total_quantity" integer,
	"available_quantity" integer,
	"includes_spouse" boolean DEFAULT false NOT NULL,
	"allows_children" boolean DEFAULT false NOT NULL,
	"allows_teacher_sponsorship" boolean DEFAULT true NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"status_note" varchar(255),
	"display_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "event_passes_event_pass_id_idx" ON "event_passes" USING btree ("event_name","pass_id");