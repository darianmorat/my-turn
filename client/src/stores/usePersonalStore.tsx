import { create } from "zustand";
import { toast } from "react-toastify";
import api from "@/api/axios";
import type { Personal } from "@/types/personal";

type PersonalStore = {
   isLoading: boolean;
   users: Personal[];
   getUsers: () => Promise<void>;
   createUser: (
      name: string,
      email: string,
      password: string,
      role: string,
   ) => Promise<void>;
   editUser: (
      id: string,
      updates: { name?: string; email?: string; password?: string; role?: string },
   ) => Promise<void>;
   deleteUser: (id: string) => Promise<void>;
};

export const usePersonalStore = create<PersonalStore>((set, get) => ({
   isLoading: false,
   users: [],

   getUsers: async () => {
      set({ isLoading: true });
      try {
         const res = await api.get("/personal/get-all");
         if (res.data.success) {
            set({ users: res.data.users });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   createUser: async (name, email, password, role) => {
      set({ isLoading: true });
      try {
         const body = {
            name: name,
            email: email,
            password: password,
            role: role,
         };

         const res = await api.post("/personal/create", body);

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
         const res = await api.post(`/personal/edit/${id}`, updates);

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
         const res = await api.delete(`/personal/delete/${id}`);

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
