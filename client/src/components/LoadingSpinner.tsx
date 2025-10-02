import { LoaderIcon } from "lucide-react";

export const LoadingSpinner = () => {
   return (
      <div className="flex h-screen w-full items-center justify-center">
         <div className="flex flex-col items-center space-y-2">
            <LoaderIcon className="animate-spin h-7 w-7" />
            <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
         </div>
      </div>
   );
};
