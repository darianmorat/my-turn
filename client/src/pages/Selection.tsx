import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/Container";
import { Users, Grid3x3, Calendar, LayoutDashboard } from "lucide-react";

export const Selection = () => {
   const navigate = useNavigate();

   const menuItems = [
      {
         icon: Users,
         title: "Cola de espera",
         description:
            "Consulta las personas que están esperando en la fila y verifica su duración.",
         action: () => navigate("/queue"),
         buttonText: "Ir a la cola",
         gradient: "from-blue-500/10 to-blue-600/10",
         iconColor: "text-blue-600",
      },
      {
         icon: Grid3x3,
         title: "Módulos",
         description: "Administra los módulos y asigna usuarios a los agentes en espera.",
         action: () => navigate("/modules"),
         buttonText: "Ir a módulos",
         gradient: "from-purple-500/10 to-purple-600/10",
         iconColor: "text-purple-600",
      },
      {
         icon: Calendar,
         title: "Turnos y usuarios",
         description:
            "Crea turnos para usuarios registrados o registra usuarios en el sistema.",
         action: () => navigate("/reception"),
         buttonText: "Ir a turnos",
         gradient: "from-green-500/10 to-green-600/10",
         iconColor: "text-green-600",
      },
      {
         icon: LayoutDashboard,
         title: "Manager Panel",
         description:
            "Gestión de agentes, recepcionistas y managers. Verificación de información general.",
         action: () => navigate("/dashboard"),
         buttonText: "Ir a Dashboard",
         gradient: "from-orange-500/10 to-orange-600/10",
         iconColor: "text-orange-600",
      },
   ];

   return (
      <Container className="flex-1 flex items-center justify-center py-8">
         <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
               <p className="text-muted-foreground">
                  Selecciona una opción para comenzar
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                     <Card
                        key={index}
                        className="shadow hover:shadow-lg transition-all duration-300 border group cursor-pointer flex flex-col"
                        onClick={item.action}
                     >
                        <CardContent className="py-6 px-16 flex flex-col h-full">
                           <div className="flex items-start gap-4 mb-4">
                              <div
                                 className={`p-3 rounded-md bg-gradient-to-br ${item.gradient} transition-transform duration-300 flex-shrink-0`}
                              >
                                 <Icon className={`w-6 h-6 ${item.iconColor}`} />
                              </div>
                              <div className="flex-1">
                                 <h2 className="text-xl font-semibold mb-2 group-hover:underline">
                                    {item.title}
                                 </h2>
                                 <p className="text-muted-foreground text-sm line-clamp-2">
                                    {item.description}
                                 </p>
                              </div>
                           </div>
                           <Button
                              className="w-full mt-auto h-9"
                              size="sm"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 item.action();
                              }}
                           >
                              {item.buttonText}
                           </Button>
                        </CardContent>
                     </Card>
                  );
               })}
            </div>
         </div>
      </Container>
   );
};
