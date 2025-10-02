import api from "@/api/axios";
import type { User } from "@/types/user";
import { toast } from "react-toastify";
import { create } from "zustand";

type UserStore = {
   isLoading: boolean;
   users: User[];
   getUsers: () => Promise<void>;
   createUser: (name: string, nationalId: string) => Promise<void>;
   editUser: (
      id: string,
      updates: { name?: string; nationalId?: string },
   ) => Promise<void>;
   deleteUser: (id: string) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
   isLoading: false,
   users: [],

   getUsers: async () => {
      set({ isLoading: true });
      try {
         const res = await api.get("/user/get-all");

         if (res.data.success) {
            set({ users: res.data.users });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   createUser: async (name, nationalId) => {
      set({ isLoading: true });
      try {
         const body = { name, nationalId };
         const res = await api.post("/user/create", body);

         if (res.data.success) {
            toast.success(res.data.message);
            const currentUsers = get().users;
            const newUser = res.data.newUser;
            set({ users: [...currentUsers, newUser] });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   editUser: async (id, updates) => {
      set({ isLoading: true });
      try {
         const res = await api.post(`/user/edit/${id}`, updates);

         if (res.data.success) {
            toast.success(res.data.message);
            const currentUsers = get().users;
            const updatedUser = res.data.user;
            set({
               users: currentUsers.map((user) => (user.id === id ? updatedUser : user)),
            });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   deleteUser: async (id) => {
      set({ isLoading: true });
      try {
         const res = await api.delete(`/user/delete/${id}`);

         if (res.data.success) {
            toast.success(res.data.message);
            const currentUsers = get().users;
            const updatedUsers = currentUsers.filter((user) => user.id !== id);
            set({ users: updatedUsers });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },
}));
