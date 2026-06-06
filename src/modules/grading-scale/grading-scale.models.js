import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const gradingScales = pgTable("grading_scales", {
    id: uuid("id").defaultRandom().primaryKey(),
    grade: varchar("grade", {
      length: 5,
    }).notNull(),
    minScore: integer("min_score").notNull(),
    maxScore: integer("max_score").notNull(),
    remarks: varchar("remarks", {length: 100,}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);