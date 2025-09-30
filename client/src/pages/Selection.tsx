import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/Container";

export const Selection = () => {
   const navigate = useNavigate();

   return (
      <Container className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
         <Card className="shadow rounded-md bg-card h-fit">
            <CardContent className="flex flex-col gap-4">
               <h2 className="font-medium">Cola de espera</h2>
               <p className="text-muted-foreground">
                  Consulta las personas que están esperando en la fila y verifica su
                  duración.
               </p>
               <Button onClick={() => navigate("/queue")}>Ir a la cola</Button>
            </CardContent>
         </Card>

         <Card className="shadow rounded-md bg-card h-fit">
            <CardContent className="flex flex-col gap-4">
               <h2 className="font-medium">Módulos</h2>
               <p className="text-muted-foreground">
                  Administra los módulos y asigna usuarios a los agentes en espera.
               </p>
               <Button onClick={() => navigate("/modules")}>Ir a módulos</Button>
            </CardContent>
         </Card>

         <Card className="shadow rounded-md bg-card h-fit">
            <CardContent className="flex flex-col gap-4">
               <h2 className="font-medium">Turnos y usuarios</h2>
               <p className="text-muted-foreground">
                  Crea turnos para usuarios registrados o registra usuarios en el sistema.
               </p>
               <Button onClick={() => navigate("/reception")}>Ir a turnos</Button>
            </CardContent>
         </Card>

         <Card className="shadow rounded-md bg-card h-fit">
            <CardContent className="flex flex-col gap-4">
               <h2 className="font-medium">Manager Panel</h2>
               <p className="text-muted-foreground">
                  Gestion de agentes, recepcionistas y managers... Verificacion de
                  informacion general
               </p>
               <Button onClick={() => navigate("/dashboard")}>Ir Dashboard</Button>
            </CardContent>
         </Card>
      </Container>
   );
};
