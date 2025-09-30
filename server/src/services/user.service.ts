import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const userService = {
   getAll: async () => {
      const result = await db.select().from(users);

      return result;
   },

   createUser: async (nationalId: string, name: string) => {
      const [result] = await db.insert(users).values({ nationalId, name }).returning();

      return result;
   },

   edit: async (
      id: string,
      updates: {
         name?: string;
         nationalId?: string;
      },
   ) => {
      const updateData: any = {};

      if (updates.name !== undefined && updates.name.trim() !== "") {
         updateData.name = updates.name;
      }

      if (updates.nationalId !== undefined && updates.nationalId.trim() !== "") {
         updateData.nationalId = updates.nationalId;
      }

      const [result] = await db
         .update(users)
         .set(updateData)
         .where(eq(users.id, id))
         .returning();

      return result;
   },

   delete: async (id: string) => {
      const [result] = await db.delete(users).where(eq(users.id, id)).returning();

      return result;
   },
};
