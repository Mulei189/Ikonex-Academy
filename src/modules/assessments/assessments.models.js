import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { students } from "../students/students.models.js";
import { subjects } from "../subjects/subjects.models.js";

export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").references(() => students.id, {
        onDelete: "cascade",
      }).notNull(),
    subjectId: uuid("subject_id").references(() => subjects.id, {
        onDelete: "cascade",
      }).notNull(),
    assessmentType: varchar(
      "assessment_type",
      {
        length: 50,
      }
    ).notNull(),
    score: integer("score").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);