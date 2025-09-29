import api from "@/api/axios";
import type { User } from "@/types/user";
import { toast } from "react-toastify";
import { create } from "zustand";

type UserStore = {
   users: User[];
   getUsers: () => Promise<void>;
   createUser: (nationalId: string, name: string) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
   users: [],

   getUsers: async () => {
      try {
         const res = await api.get("/user/get-all");

         if (res.data.success) {
            set({ users: res.data.users });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   createUser: async (nationalId, name) => {
      try {
         const body = { nationalId, name };
         const res = await api.post("/user/create", body);

         if (res.data.success) {
            toast.success(res.data.message);

            const currentUsers = get().users;
            const newUser = res.data.newUser;
            set({ users: [...currentUsers, newUser] });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },
}));
