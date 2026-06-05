import {
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { classStreams } from "../class-streams/class-streams.models.js";
import { subjects } from "./subjects.models.js";

export const classStreamSubjects =
  pgTable("class_stream_subjects", {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    classStreamId: uuid(
      "class_stream_id"
    )
      .references(
        () => classStreams.id,
        {
          onDelete: "cascade",
        }
      )
      .notNull(),

    subjectId: uuid(
      "subject_id"
    )
      .references(
        () => subjects.id,
        {
          onDelete: "cascade",
        }
      )
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  });