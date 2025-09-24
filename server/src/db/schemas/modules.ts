import { uuid, timestamp, boolean, varchar, pgTable } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { turns } from "./turns";

export const modules = pgTable("modules", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   name: varchar("name", { length: 100 }).notNull(),
   description: varchar("description", { length: 255 }),
   isActive: boolean("is_active").default(true),
   agentName: varchar("agent_name", { length: 255 }),
   createdAt: timestamp("created_at").defaultNow(),
});

export const modulesRelations = relations(modules, ({ many }) => ({
   turns: many(turns),
}));
