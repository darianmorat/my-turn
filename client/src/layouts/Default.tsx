import { ModeToggle } from "@/components/ModeToggle";
import { Outlet } from "react-router-dom";

export const Default = () => {
   return (
      <div className="min-h-screen flex flex-col">
         <Outlet />
         <div className="fixed bottom-0 right-0 m-4 z-10">
            <ModeToggle />
         </div>
      </div>
   );
};
