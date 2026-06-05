import {
    varchar,
    pgTable,
    serial,
    text,
    timestamp,
    pgEnum
    } from "drizzle-orm/pg-core";

// Define Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    role: userRoleEnum('role').notNull().default('user'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})