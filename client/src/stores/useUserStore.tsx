import api from "@/api/axios";
import { toast } from "react-toastify";
import { create } from "zustand";

type User = {
   nationalId: string;
   name: string;
};

type Users = {
   id: string;
   nationalId: string;
   name: string;
};

type Store = {
   users: Users[];
   getUsers: () => Promise<void>;
   createUser: (values: User) => Promise<void>;
};

export const useUserStore = create<Store>((set, get) => ({
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

   createUser: async (values) => {
      try {
         const body = {
            nationalId: values.nationalId,
            name: values.name,
         };

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
