import { uuid, timestamp, varchar, pgTable } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { turns } from "./turns";

export const users = pgTable("users", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   name: varchar("name", { length: 100 }).notNull(),
   nationalId: varchar("national_id", { length: 255 }).notNull().unique(),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  turns: many(turns),
}));

