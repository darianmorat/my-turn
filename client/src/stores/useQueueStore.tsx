import api from "@/api/axios";
import type { Module, QueueStats, Turn } from "@/types/queue";
import { toast } from "react-toastify";
import { create } from "zustand";

type QueueStore = {
   // State
   waitingTurns: Turn[];
   currentlyServed: Turn[];
   modules: Module[];
   stats: QueueStats | null;
   isLoading: boolean;

   // Reception actions
   createTurn: (nationalId: string) => Promise<Turn | null>;
   cancelTurn: (turnId: string) => Promise<void>;
   getWaitingTurns: () => Promise<void>;
   getStats: () => Promise<void>;

   // Agent actions
   callNext: (moduleId: string) => Promise<Turn | null>;
   completeTurn: (turnId: string) => Promise<void>;
   getCurrentlyServed: () => Promise<void>;

   // System actions
   getModules: () => Promise<void>;
   createModule: (name: string, description: string) => Promise<void>;
   editModule: (
      id: string,
      updates: { name?: string; description?: string },
   ) => Promise<void>;
   deleteModule: (id: string) => Promise<void>;

   // Utils
   refreshAll: () => Promise<void>;
};

export const useQueueStore = create<QueueStore>((set, get) => ({
   waitingTurns: [],
   currentlyServed: [],
   modules: [],
   stats: null,
   isLoading: false,

   // Reception actions
   createTurn: async (nationalId: string) => {
      set({ isLoading: true });
      try {
         const body = { nationalId: nationalId };
         const res = await api.post("/queue/create", body);
         const turn = res.data.turn;

         if (res.data.success) {
            toast.success(res.data.message);
            get().getWaitingTurns();
            return turn;
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   getWaitingTurns: async () => {
      try {
         const res = await api.get("/queue/waiting");

         if (res.data.success) {
            set({ waitingTurns: res.data.turns });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   cancelTurn: async (turnId: string) => {
      try {
         set({ isLoading: true });
         const res = await api.post(`/queue/cancel/${turnId}`);

         if (res.data.success) {
            toast.success(res.data.message);

            // Refresh waiting turns and stats
            await Promise.all([
               get().getWaitingTurns(),
               get().getCurrentlyServed(),
               get().getStats(),
            ]);
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   getStats: async () => {
      try {
         const res = await api.get("/queue/stats");

         if (res.data.success) {
            set({ stats: res.data.stats });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   // Agent actions
   callNext: async (moduleId: string) => {
      try {
         set({ isLoading: true });
         const res = await api.post("/queue/call-next", { moduleId });

         if (res.data.success) {
            if (res.data.turn) {
               toast.success(res.data.message);

               // Refresh both waiting and currently served
               await Promise.all([
                  get().getWaitingTurns(),
                  get().getCurrentlyServed(),
                  get().getStats(),
               ]);

               return res.data.turn;
            } else {
               toast.info("No one waiting in queue");
               return null;
            }
         }
         return null;
      } catch (error) {
         toast.error(error.response.data.message);
         return null;
      } finally {
         set({ isLoading: false });
      }
   },

   completeTurn: async (turnId: string) => {
      try {
         set({ isLoading: true });
         const res = await api.post(`/queue/complete/${turnId}`);

         if (res.data.success) {
            toast.success(res.data.message);

            // Refresh currently served and stats
            await Promise.all([get().getCurrentlyServed(), get().getStats()]);
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   getCurrentlyServed: async () => {
      try {
         const res = await api.get("/queue/currently-served");

         if (res.data.success) {
            set({ currentlyServed: res.data.turns });
         }
      } catch (error) {
         console.error("Failed to fetch currently served turns:", error);
      }
   },

   // System actions
   getModules: async () => {
      set({ isLoading: true });
      try {
         const res = await api.get("/module/get-all");

         if (res.data.success) {
            set({ modules: res.data.modules });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   createModule: async (name, description) => {
      set({ isLoading: true });
      try {
         const body = {
            name,
            description,
         };
         const res = await api.post("/module/create", body);

         if (res.data.success) {
            toast.success(res.data.message);
            const currentModules = get().modules;
            const newModule = res.data.newModule;
            set({ modules: [...currentModules, newModule] });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   editModule: async (id, updates) => {
      set({ isLoading: true });
      try {
         const res = await api.post(`/module/edit/${id}`, updates);

         if (res.data.success) {
            toast.success(res.data.message);
            const currentModules = get().modules;
            const updatedModule = res.data.module;
            set({
               modules: currentModules.map((module) =>
                  module.id === id ? updatedModule : module,
               ),
            });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   deleteModule: async (id) => {
      set({ isLoading: true });
      try {
         const res = await api.post(`/module/delete/${id}`);

         if (res.data.success) {
            toast.success(res.data.message);
            const currentModules = get().modules;
            const updatedModules = currentModules.filter((module) => module.id !== id);
            set({ modules: updatedModules });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   // Refresh all data
   refreshAll: async () => {
      await Promise.all([
         get().getWaitingTurns(),
         get().getCurrentlyServed(),
         get().getStats(),
         get().getModules(),
      ]);
   },
}));
