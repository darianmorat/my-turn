import { pgEnum, uuid, varchar, pgTable, timestamp, date } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { users } from "./users";
import { modules } from "./modules";
import { personal } from "./personal";

export const turnStatusEnum = pgEnum("turn_status", [
   "waiting",
   "being_served",
   "completed",
   "cancelled",
]);

export const turns = pgTable("turns", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
   userName: varchar("user_name").notNull(),
   userNationalId: varchar("user_national_id").notNull(),

   // Modules
   moduleId: uuid("module_id").references(() => modules.id, { onDelete: "cascade" }),
   ticketCode: varchar("ticket_code", { length: 10 }).notNull().unique(), // A001, A002, etc.
   status: turnStatusEnum("status").default("waiting"),

   // Timestamps for tracking
   createdAt: timestamp("created_at").defaultNow(),
   calledAt: timestamp("called_at"), // When assigned to module
   completedAt: timestamp("completed_at"), // When service finished

   // agent
   completedBy: uuid("completed_by").references(() => personal.id),

   // Daily tracking
   serviceDate: date("service_date").defaultNow(),
});

export const turnsRelations = relations(turns, ({ one }) => ({
   user: one(users, {
      fields: [turns.userId],
      references: [users.id],
   }),
   module: one(modules, {
      fields: [turns.moduleId],
      references: [modules.id],
   }),
}));
