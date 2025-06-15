import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "system"]);

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfPath: text("pdf_path").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id").notNull(),
  fileKey: text("file_key").notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  role: rolesEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export type CHATS_TYPE = typeof chats.$inferSelect;
export type MESSAGES_TYPE = {status?: string} & typeof messages.$inferSelect;
