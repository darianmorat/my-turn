import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
   const navigate = useNavigate();

   return (
      <Container>
         <div className="flex flex-col gap-4 items-center justify-center h-screen mt-[-40px]">
            <h2 className="text-4xl font-bold">404</h2>
            <div className="text-gray-500">Opps! Parece que esta pagina no existe</div>
            <Button onClick={() => navigate("/")}>Volver a inicio</Button>
         </div>
      </Container>
   );
};
