import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
   const navigate = useNavigate();

   return (
      <div className="p-10 flex gap-3">
         <Button onClick={() => navigate("/1")}>Page 1</Button>
         <Button onClick={() => navigate("/2")}>Page 2</Button>
         <Button onClick={() => navigate("/3")}>Page 3</Button>
      </div>
   );
};
