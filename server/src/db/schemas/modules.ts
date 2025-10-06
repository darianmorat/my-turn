import { uuid, timestamp, boolean, varchar, pgTable } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { turns } from "./turns";
import { personal } from "./personal";

export const modules = pgTable("modules", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   name: varchar("name", { length: 100 }).notNull(),
   description: varchar("description", { length: 255 }),
   isActive: boolean("is_active").default(true),
   currentAgent: uuid("current_agent").references(() => personal.id),
   createdAt: timestamp("created_at").defaultNow(),
});

export const modulesRelations = relations(modules, ({ many, one }) => ({
   turns: many(turns),
   agent: one(personal, {
      fields: [modules.currentAgent],
      references: [personal.id],
   }),
}));
