import { ActivityIcon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const SoundUnlocker = () => {
   const [soundEnabled, setSoundEnabled] = useState(false);

   useEffect(() => {
      if (!soundEnabled) return;
      const audio = new Audio("/bell.mp3");
      audio.play().catch(() => {});
   }, [soundEnabled]);

   if (!soundEnabled) {
      return (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 h-screen">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 max-w-md text-center space-y-6 border border-neutral-200 dark:border-neutral-800">
               <div className="flex flex-col items-center space-y-3">
                  <Bell className="w-12 h-12 text-yellow-500" />
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                     Habilitar sonido
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-94">
                     Para poder reproducir las notificaciones sonoras, necesitamos tu
                     confirmación. Haz clic en el botón de abajo para activar el sonido de
                     la campana cuando un nuevo turno sea llamado.
                  </p>
               </div>
               <Button size="lg" className="w-full" onClick={() => setSoundEnabled(true)}>
                  <ActivityIcon className="mr-2" /> Activar sonido
               </Button>
               <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  Podrás desactivar el sonido en cualquier momento cerrando esta pestaña.
               </p>
            </div>
         </div>
      );
   }
};
