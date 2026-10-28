CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(30),
	"full_name" varchar(150) NOT NULL,
	"password_hash" text NOT NULL,
	"password_salt" varchar(64) NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"batch_year" varchar(20),
	"house" varchar(50),
	"membership_type" varchar(50) DEFAULT 'Life Member' NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"avatar_url" varchar(500),
	"metadata" jsonb,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_member_id_unique" ON "users" USING btree ("member_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_mobile_idx" ON "users" USING btree ("mobile");--> statement-breakpoint
CREATE INDEX "users_batch_year_idx" ON "users" USING btree ("batch_year");--> statement-breakpoint
CREATE TABLE "membership_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(30) NOT NULL,
	"membership_type" varchar(50) DEFAULT 'Life Member' NOT NULL,
	"title" varchar(20) NOT NULL,
	"batch_year" varchar(20) NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"middle_name" varchar(80),
	"last_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"country_code" varchar(8) NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"password_hash" varchar(128) NOT NULL,
	"password_salt" varchar(64) NOT NULL,
	"share_email" boolean DEFAULT false NOT NULL,
	"address_line1" varchar(200) NOT NULL,
	"address_line2" varchar(200),
	"address_line3" varchar(200),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"zip" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"tracking_id" varchar(50),
	"bank_ref_no" varchar(100),
	"payment_mode" varchar(50),
	"gateway_status" varchar(30),
	"gateway_message" varchar(255),
	"gateway_response" jsonb,
	"user_id" integer,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "membership_applications_order_id_unique" ON "membership_applications" USING btree ("order_id");
--> statement-breakpoint
CREATE INDEX "membership_applications_email_idx" ON "membership_applications" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "membership_applications_status_idx" ON "membership_applications" USING btree ("status");
