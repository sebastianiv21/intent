CREATE TYPE "public"."allocation_bucket" AS ENUM('needs', 'wants', 'future');--> statement-breakpoint
CREATE TYPE "public"."budget_period" AS ENUM('monthly', 'weekly');--> statement-breakpoint
CREATE TYPE "public"."recurrence_frequency" AS ENUM('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('expense', 'income');--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"category_id" uuid,
	"amount" numeric(12, 2) NOT NULL,
	"period" "budget_period" NOT NULL,
	"start_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"allocation_bucket" "allocation_bucket",
	"icon" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_profile" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"monthly_income_target" numeric(10, 2) NOT NULL,
	"needs_percentage" numeric(5, 2) DEFAULT '50.00' NOT NULL,
	"wants_percentage" numeric(5, 2) DEFAULT '30.00' NOT NULL,
	"future_percentage" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recurring_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"category_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"description" varchar(255),
	"frequency" "recurrence_frequency" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"next_due_date" date NOT NULL,
	"last_generated_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"category_id" uuid,
	"amount" numeric(12, 2) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"description" text,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;