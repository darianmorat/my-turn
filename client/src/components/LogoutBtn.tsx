import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export const LogoutBtn = () => {
   const { logout } = useAuthStore();

   return (
      <Button
         variant="outline"
         size="icon"
         className="border border-red-600/20 bg-red-600/20 dark:bg-red-800/30 hover:bg-red-600/30 dark:hover:bg-red-600/25 text-red-600 hover:text-red-500"
         onClick={() => logout()}
      >
         <LogOut className="h-[1.2rem] w-[1.2rem] transition-all" />
      </Button>
   );
};
