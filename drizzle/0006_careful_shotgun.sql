ALTER TABLE "class_streams" DROP CONSTRAINT "class_streams_name_unique";--> statement-breakpoint
ALTER TABLE "class_streams" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "class_streams" ADD COLUMN "stream_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "class_streams" ADD CONSTRAINT "class_streams_stream_code_unique" UNIQUE("stream_code");