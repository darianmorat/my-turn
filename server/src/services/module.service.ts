import { eq } from "drizzle-orm";
import { db } from "../db";
import { modules } from "../db/schema";

export const moduleService = {
   getAll: async () => {
      const result = await db.query.modules.findMany({
         with: {
            agent: true,
         },
      });

      return result;
   },

   exists: async (name: string) => {
      const [result] = await db
         .select()
         .from(modules)
         .where(eq(modules.name, name))
         .limit(1);

      return result;
   },

   create: async (name: string, description: string) => {
      const [result] = await db.insert(modules).values({ name, description }).returning();

      return result;
   },

   edit: async (
      id: string,
      updates: {
         name?: string;
         description?: string;
      },
   ) => {
      const updateData: any = {};

      if (updates.name !== undefined && updates.name.trim() !== "") {
         updateData.name = updates.name;
      }

      if (updates.description !== undefined && updates.description.trim() !== "") {
         updateData.description = updates.description;
      }

      const [result] = await db
         .update(modules)
         .set(updateData)
         .where(eq(modules.id, id))
         .returning();

      return result;
   },

   delete: async (id: string) => {
      const [result] = await db.delete(modules).where(eq(modules.id, id)).returning();

      return result;
   },
};
