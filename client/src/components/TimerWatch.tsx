import { Clock } from "lucide-react";

export const TimerWatch = () => {
   const currentTime = new Date().toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
   });

   return (
      <div className="flex items-center justify-center gap-12 text-muted-foreground">
         <div className="flex items-center gap-2">
            <Clock size={20} />
            <span>{currentTime}</span>
         </div>
      </div>
   );
};
