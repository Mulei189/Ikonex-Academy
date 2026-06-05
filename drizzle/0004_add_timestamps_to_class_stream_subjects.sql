ALTER TABLE "class_stream_subjects" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "class_stream_subjects" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;