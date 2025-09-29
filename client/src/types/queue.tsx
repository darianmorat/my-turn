import type { User } from "./user";

export type TurnStatus = "waiting" | "being_served" | "completed" | "cancelled";

export type Module = {
   id: string;
   name: string;
   description?: string;
   isActive: boolean;
   agentName?: string;
};

export type Turn = {
   id: string;
   userId: string;
   moduleId?: string;
   ticketCode: string;
   status: TurnStatus;

   createdAt: string;
   calledAt?: string;
   completedAt?: string;

   serviceDate: string;

   user: User;
   module?: Module;
};

export type QueueStats = {
   waiting: number;
   beingServed: number;
   completed: number;
   cancelled: number;
   nextTicket: string | null;
   totalToday: number;
};
