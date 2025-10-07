import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GoBackBtn = () => {
   const navigate = useNavigate();

   return (
      <a
         onClick={() => navigate("/selection")}
         className="absolute flex items-center gap-2 font-medium text-sm px-4 py-2 hover:underline hover:cursor-pointer"
      >
         <ArrowLeft className="w-4 h-4" />
         Volver
      </a>
   );
};
