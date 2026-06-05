import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  subjectCode: varchar("code", {
    length: 20,
  })
    .notNull()
    .unique(),

  name: varchar("name", {
    length: 100,
  })
    .notNull()
    .unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});