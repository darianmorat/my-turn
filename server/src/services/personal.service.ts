import { eq } from "drizzle-orm";
import { db } from "../db";
import { personal } from "../db/schema";
import { genSalt, hash } from "bcrypt-ts";

export const personalService = {
   findForAuth: async (email: string) => {
      const [result] = await db
         .select({
            id: personal.id,
            password: personal.password,
         })
         .from(personal)
         .where(eq(personal.email, email))
         .limit(1);

      return result;
   },

   findById: async (id: string) => {
      const [result] = await db
         .select()
         .from(personal)
         .where(eq(personal.id, id))
         .limit(1);

      return result;
   },

   findAll: async () => {
      const result = await db.select().from(personal);

      return result;
   },

   exists: async (email: string) => {
      const [result] = await db
         .select({
            email: personal.email,
         })
         .from(personal)
         .where(eq(personal.email, email))
         .limit(1);

      return result;
   },

   create: async (
      name: string,
      email: string,
      password: string,
      role: "admin" | "agent" | "receptionist",
   ) => {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const [result] = await db
         .insert(personal)
         .values({ name, email, password: hashedPassword, role })
         .returning();

      return result;
   },

   edit: async (
      id: string,
      updates: {
         name?: string;
         email?: string;
         password?: string;
         role?: "admin" | "agent" | "receptionist";
      },
   ) => {
      const updateData: any = {};

      if (updates.name !== undefined && updates.name.trim() !== "") {
         updateData.name = updates.name;
      }

      if (updates.email !== undefined && updates.email.trim() !== "") {
         updateData.email = updates.email;
      }

      if (updates.role !== undefined && updates.role.trim() !== "") {
         updateData.role = updates.role;
      }

      if (updates.password !== undefined && updates.password.trim() !== "") {
         const salt = await genSalt(10);
         const hashedPassword = await hash(updates.password, salt);
         updateData.password = hashedPassword;
      }

      const [result] = await db
         .update(personal)
         .set(updateData)
         .where(eq(personal.id, id))
         .returning();

      return result;
   },

   delete: async (id: string) => {
      const [result] = await db.delete(personal).where(eq(personal.id, id)).returning();

      return result;
   },
};
