import { sql } from "drizzle-orm";
import {
  text,
  varchar,
  timestamp,
  pgTable,
  boolean,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { nanoid } from "@/lib/utils";

export const notes = pgTable("notes", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  isPinned: boolean("is_pinned").default(false),
  color: varchar("color", { length: 7 }).default("#ffffff"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const insertNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  color: z.string().max(7).optional(),
});

export const updateNoteSchema = insertNoteSchema.partial();

export type Note = typeof notes.$inferSelect;
export type NewNoteParams = z.infer<typeof insertNoteSchema>;
export type UpdateNoteParams = z.infer<typeof updateNoteSchema>;
