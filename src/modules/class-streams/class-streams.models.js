import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    uuid,
} from 'drizzle-orm/pg-core';

export const classStreams = pgTable(
  "class_streams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    streamCode: varchar("stream_code", { length: 20 })
      .unique()
      .notNull(),

    name: varchar("name", {length: 100,}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);