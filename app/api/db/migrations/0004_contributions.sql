CREATE TABLE "contribution_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"contribution_id" integer NOT NULL,
	"kind" varchar(20) NOT NULL,
	"storage_path" varchar(255) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"size_bytes" integer NOT NULL,
	"original_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contribution_funds" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(30) NOT NULL,
	"label" varchar(100) NOT NULL,
	"note" varchar(100),
	"unit_amount" integer,
	"unit_label" varchar(30),
	"max_units" integer,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(30) NOT NULL,
	"user_id" integer NOT NULL,
	"fund_id" integer NOT NULL,
	"units" integer,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"donor_name" varchar(160) NOT NULL,
	"batch" varchar(20),
	"email" varchar(255) NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"address" varchar(300) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"pincode" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"wants_80g" boolean DEFAULT false NOT NULL,
	"pan" varchar(10),
	"address_doc_number" varchar(60),
	"preferred_payment_method" varchar(20),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"tracking_id" varchar(50),
	"bank_ref_no" varchar(100),
	"payment_mode" varchar(50),
	"gateway_status" varchar(30),
	"gateway_message" varchar(255),
	"gateway_response" jsonb,
	"paid_at" timestamp with time zone,
	"thank_you_email_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contribution_documents" ADD CONSTRAINT "contribution_documents_contribution_id_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."contributions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_fund_id_contribution_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."contribution_funds"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contribution_documents_contribution_kind_unique" ON "contribution_documents" USING btree ("contribution_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "contribution_funds_code_unique" ON "contribution_funds" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "contributions_order_id_unique" ON "contributions" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "contributions_user_id_idx" ON "contributions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "contributions_fund_id_idx" ON "contributions" USING btree ("fund_id");--> statement-breakpoint
CREATE INDEX "contributions_status_idx" ON "contributions" USING btree ("status");--> statement-breakpoint
-- Seed: the funds the contribution form offers. Codes are what the form and the API use.
INSERT INTO "contribution_funds" ("code", "label", "note", "unit_amount", "unit_label", "max_units", "status", "sort_order") VALUES
  ('tbf', 'Teachers Benevolent Fund', NULL, NULL, NULL, NULL, 'active', 1),
  ('sponsor', 'Sponsor a teacher', '₹5,000 per teacher', 5000, 'teacher', 10, 'active', 2),
  ('general', 'General Contribution', NULL, NULL, NULL, NULL, 'active', 3),
  ('secretariat', 'OCA Secretariat Contribution', NULL, NULL, NULL, NULL, 'active', 4),
  ('breakfast', 'OCA Breakfast Programme', 'Currently suspended', NULL, NULL, NULL, 'suspended', 5)
ON CONFLICT ("code") DO NOTHING;
