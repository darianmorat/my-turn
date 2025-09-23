import { uuid, timestamp, varchar, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   nationalId: varchar("national_id", { length: 255 }).notNull().unique(),
   name: varchar({ length: 255 }).notNull(),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
