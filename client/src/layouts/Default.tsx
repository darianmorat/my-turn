import { LogoutBtn } from "@/components/LogoutBtn";
import { ModeToggle } from "@/components/ModeToggle";
import { useAuthStore } from "@/stores/useAuthStore";
import { Outlet } from "react-router-dom";

export const Default = () => {
   const { isAuth } = useAuthStore();

   return (
      <div className="min-h-screen flex flex-col">
         <Outlet />
         <div className="flex flex-col gap-2 fixed bottom-0 right-0 m-4 z-10">
            <ModeToggle />
            {isAuth ? <LogoutBtn /> : <></>}
         </div>
      </div>
   );
};
