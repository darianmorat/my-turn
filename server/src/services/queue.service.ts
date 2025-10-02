import { asc, eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import { modules, queue, turns, users } from "../db/schema";

export const queueService = {
   createTurn: async (nationalId: string) => {
      const [user] = await db
         .select()
         .from(users)
         .where(eq(users.nationalId, nationalId))
         .limit(1);

      if (!user) {
         throw new Error("User not found. Please register first.");
      }

      return queueService.createTurnForUser(user.id, user.name, user.nationalId);
   },

   createTurnForUser: async (
      userId: string,
      userName: string,
      userNationalId: string,
   ) => {
      try {
         const today = new Date().toISOString().split("T")[0];

         // Get/create daily counter for ticket codes
         let counter = await db
            .select()
            .from(queue)
            .where(eq(queue.serviceDate, today))
            .limit(1);

         if (counter.length === 0) {
            const [newCounter] = await db
               .insert(queue)
               .values({
                  currentNumber: 0,
                  serviceDate: today,
               })
               .returning();
            counter = [newCounter];
         }

         // Increment ticket counter
         const currentTicketNumber = counter[0]?.currentNumber ?? 0;
         const newTicketNumber = currentTicketNumber + 1;

         await db
            .update(queue)
            .set({ currentNumber: newTicketNumber })
            .where(eq(queue.serviceDate, today));

         const ticketCode = `A${newTicketNumber.toString().padStart(3, "0")}`;

         const [newTurn] = await db
            .insert(turns)
            .values({
               userId,
               userName,
               userNationalId,
               ticketCode,
               status: "waiting",
               serviceDate: today,
            })
            .returning();

         const turnWithUser = await queueService.getTurnWithUser(newTurn.id);
         return turnWithUser!;
      } catch (error) {
         throw new Error(`Failed to create turn: ${error}`);
      }
   },

   cancelTurn: async (turnId: string) => {
      const [turn] = await db.select().from(turns).where(eq(turns.id, turnId)).limit(1);

      if (!turn) {
         throw new Error("Turn not found");
      }

      if (turn.status === "completed") {
         throw new Error("Cannot cancel a completed turn");
      }

      if (turn.status === "cancelled") {
         throw new Error("Turn is already cancelled");
      }

      // Update turn status to cancelled
      await db
         .update(turns)
         .set({
            status: "cancelled",
            completedAt: new Date(), // Using completedAt as cancelledAt
         })
         .where(eq(turns.id, turnId));

      // Return updated turn
      const updatedTurn = await queueService.getTurnWithUser(turnId);
      return updatedTurn!;
   },

   getNextInQueue: async () => {
      const nextTurn = await db
         .select()
         .from(turns)
         .leftJoin(users, eq(turns.userId, users.id))
         .where(eq(turns.status, "waiting"))
         .orderBy(asc(turns.createdAt))
         .limit(1);

      if (nextTurn.length === 0) return null;

      return {
         ...nextTurn[0].turns,
         user: nextTurn[0].users!,
      };
   },

   assignToModule: async (moduleId: string) => {
      try {
         // Get next person in queue
         const nextTurn = await queueService.getNextInQueue();
         if (!nextTurn) {
            throw new Error("No one waiting in queue");
         }

         // Check if module is available (not currently serving someone)
         const moduleInUse = await db
            .select()
            .from(turns)
            .where(and(eq(turns.moduleId, moduleId), eq(turns.status, "being_served")))
            .limit(1);

         if (moduleInUse.length > 0) {
            throw new Error("Module is currently busy");
         }

         // Assign turn to module
         await db
            .update(turns)
            .set({
               moduleId,
               status: "being_served",
               calledAt: new Date(),
            })
            .where(eq(turns.id, nextTurn.id));

         // Return updated turn
         const updatedTurn = await queueService.getTurnWithUser(nextTurn.id);
         return updatedTurn!;
      } catch (error) {
         throw new Error(`Failed to assign to module: ${error}`);
      }
   },

   completeTurn: async (turnId: string) => {
      await db
         .update(turns)
         .set({
            status: "completed",
            completedAt: new Date(),
         })
         .where(eq(turns.id, turnId));
   },

   getWaitingTurns: async () => {
      const waitingTurns = await db
         .select()
         .from(turns)
         .leftJoin(users, eq(turns.userId, users.id))
         .where(eq(turns.status, "waiting"))
         .orderBy(asc(turns.createdAt));

      return waitingTurns.map((turn) => ({
         ...turn.turns,
         user: turn.users!,
      }));
   },

   getCurrentlyServed: async () => {
      const servingTurns = await db
         .select()
         .from(turns)
         .leftJoin(users, eq(turns.userId, users.id))
         .leftJoin(modules, eq(turns.moduleId, modules.id))
         .where(eq(turns.status, "being_served"))
         .orderBy(asc(turns.moduleId));

      return servingTurns.map((turn) => ({
         ...turn.turns,
         user: turn.users!,
         module: turn.modules || undefined,
      }));
   },

   getTurnWithUser: async (turnId: string) => {
      const result = await db
         .select()
         .from(turns)
         .leftJoin(users, eq(turns.userId, users.id))
         .leftJoin(modules, eq(turns.moduleId, modules.id))
         .where(eq(turns.id, turnId))
         .limit(1);

      if (result.length === 0) return null;

      return {
         ...result[0].turns,
         user: result[0].users!,
         module: result[0].modules || undefined,
      };
   },

   getQueueStats: async () => {
      const today = new Date().toISOString().split("T")[0];

      const stats = await db
         .select({
            status: turns.status,
            count: sql<number>`count(*)`,
         })
         .from(turns)
         .where(eq(turns.serviceDate, today))
         .groupBy(turns.status);

      const nextInQueue = await queueService.getNextInQueue();

      const totalToday = await db
         .select({ count: sql<number>`count(*)` })
         .from(turns)
         .where(eq(turns.serviceDate, today));

      return {
         waiting: stats.find((s) => s.status === "waiting")?.count || 0,
         beingServed: stats.find((s) => s.status === "being_served")?.count || 0,
         completed: stats.find((s) => s.status === "completed")?.count || 0,
         cancelled: stats.find((s) => s.status === "cancelled")?.count || 0,
         nextTicket: nextInQueue?.ticketCode || null,
         totalToday: totalToday[0].count,
      };
   },
};
