CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admission_number" varchar(50) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"date_of_birth" date,
	"class_stream_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_admission_number_unique" UNIQUE("admission_number")
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_stream_id_class_streams_id_fk" FOREIGN KEY ("class_stream_id") REFERENCES "public"."class_streams"("id") ON DELETE restrict ON UPDATE no action;