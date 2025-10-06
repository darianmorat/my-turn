import { uuid, pgEnum, timestamp, varchar, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { modules } from "./modules";

export const personalRoleEnum = pgEnum("user_role", ["admin", "agent", "receptionist"]);

export const personal = pgTable("personal", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   name: varchar("name", { length: 100 }).notNull(),
   email: varchar({ length: 255 }).notNull().unique(),
   password: varchar({ length: 60 }).notNull(),
   role: personalRoleEnum("role").default("agent").notNull(),
   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const personalRelations = relations(personal, ({ many }) => ({
   modules: many(modules),
}));
