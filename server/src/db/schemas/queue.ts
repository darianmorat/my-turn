import { uuid, pgTable, integer, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const queue = pgTable("queue", {
   id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
   currentNumber: integer("current_number").default(0),
   serviceDate: date("service_date").defaultNow(),
});
