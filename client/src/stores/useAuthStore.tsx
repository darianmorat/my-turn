import { create } from "zustand";
import { toast } from "react-toastify";
import api from "@/api/axios";
import type { Personal } from "@/types/personal";

type AuthStore = {
   isAuth: boolean;
   isLoading: boolean;
   checkingAuth: boolean;
   isCountingDown: boolean;
   user: Personal | null;
   authenticate: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
   checkAuth: () => Promise<void>;
   startExpiryCountdown: () => void;
   logoutWithCountdown: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
   isAuth: false,
   isLoading: false,
   checkingAuth: true,
   user: null,
   isCountingDown: false,

   authenticate: async (email, password) => {
      set({ isLoading: true });
      try {
         const body = {
            email: email,
            password: password,
         };

         const res = await api.post("/auth/login", body);

         if (res.data.success) {
            await get().checkAuth();
            toast.success(res.data.message);
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoading: false });
      }
   },

   logout: async () => {
      try {
         const res = await api.post("/auth/logout");

         if (res.data.success) {
            set({ isAuth: false, user: null });
            toast.info(res.data.message);
         }
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   checkAuth: async () => {
      const cookie = document.cookie.includes("flag");

      if (!cookie) {
         set({ isAuth: false, checkingAuth: false, user: null });
         return;
      }

      set({ checkingAuth: true });
      try {
         const res = await api.get("/auth/verify");

         if (res.data.success) {
            set({ isAuth: true, user: res.data.user });
            get().startExpiryCountdown();
         }
      } catch (_error) {
         set({ isAuth: false, user: null });
      } finally {
         set({ checkingAuth: false });
      }
   },

   startExpiryCountdown: () => {
      const checkExpiry = () => {
         const cookie = document.cookie.includes("flag");

         if (!cookie) {
            get().logoutWithCountdown();
            return;
         }

         setTimeout(checkExpiry, 15 * 60 * 1000); // 15m
      };

      checkExpiry();
   },

   logoutWithCountdown: () => {
      if (!get().isAuth) return;
      set({ isCountingDown: true });

      let countdown = 5;
      // toast.info(`Session expired! Logging out in ${countdown} seconds...`);

      const timer = setInterval(() => {
         countdown--;
         console.log(countdown);

         if (countdown <= 0) {
            clearInterval(timer);
            set({ isCountingDown: false });
            get().logout();
         }
      }, 1000);
   },
}));
