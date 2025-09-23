import { db } from "../db";
import { users } from "../db/schema";

export const userService = {
   getAll: async () => {
      const result = await db.select().from(users);

      return result;
   },

   create: async (nationalId: string, name: string) => {
      const [result] = await db.insert(users).values({ nationalId, name }).returning();

      return result;
   },
};
