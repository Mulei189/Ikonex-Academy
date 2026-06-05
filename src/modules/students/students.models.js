import {
  pgTable,
  uuid,
  varchar,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { classStreams } from "../class-streams/class-streams.models.js";

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  admissionNumber: varchar("admission_number",{ length: 50 }).notNull().unique(),
  firstName: varchar("first_name", {length: 100,}).notNull(),
  lastName: varchar("last_name", {length: 100,}).notNull(),
  gender: varchar("gender", {length: 20,}).notNull(),
  dateOfBirth: date("date_of_birth"),
  classStreamId: uuid("class_stream_id").references(
      () => classStreams.id,
      {
        onDelete: "restrict",
      }
    )
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});