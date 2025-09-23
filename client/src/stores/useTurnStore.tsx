import api from "@/api/axios";
import { toast } from "react-toastify";
import { create } from "zustand";

type Turn = {
   nationalId: string;
};

type Store = {
   turns: Turn[];
   // getTurns: () => Promise<void>;
   createTurn: (values: Turn) => Promise<void>;
};

export const useTurnStore = create<Store>((set, get) => ({
   turns: [],

   // getTurns: async () => {
   //    try {
   //       const res = await api.get("/user/get-all");
   //
   //       if (res.data.success) {
   //          set({ users: res.data.users });
   //       }
   //    } catch (error) {
   //       toast.error(error.response.data.message);
   //    }
   // },

   createTurn: async (values) => {
      try {
         const body = {
            nationalId: values.nationalId,
         };

         const res = await api.post("/turn/create", body);

         if (res.data.success) {
            toast.success(res.data.message);

            const currentTurns = get().turns;
            const newTurn = res.data.newTurn;
            set({ turns: [...currentTurns, newTurn] });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },
}));
