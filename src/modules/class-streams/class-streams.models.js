import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    uuid,
} from 'drizzle-orm/pg-core';

export const classStreams = pgTable('class_streams', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})