import { useEffect } from "react";
import { useQueueStore } from "@/stores/useQueueStore";
import {
   UserCheck,
   CheckCircle,
   Users,
   Phone,
   PhoneOff,
   LogInIcon,
   LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Container";
import { TimerWatch } from "@/components/TimerWatch";
import { useAuthStore } from "@/stores/useAuthStore";
import { GoBackBtn } from "@/components/GoBackBtn";

export const ModuleDashboard = () => {
   const {
      modules,
      currentlyServed,
      waitingTurns,
      stats,
      callNext,
      completeTurn,
      getCurrentlyServed,
      takeModule,
      leaveModule,
      getModules,
      getWaitingTurns,
      getStats,
   } = useQueueStore();

   const { user } = useAuthStore();

   useEffect(() => {
      const fetchData = async () => {
         await Promise.all([
            getModules(),
            getCurrentlyServed(),
            getWaitingTurns(),
            getStats(),
         ]);
      };

      fetchData();
      const interval = setInterval(fetchData, 3000);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleCallNext = async (moduleId: string) => {
      await callNext(moduleId);
   };

   const handleComplete = async (turnId: string) => {
      if (!user?.id) return;
      await completeTurn(turnId, user.id);
   };

   const getModuleStatus = (moduleId: string) => {
      const serving = currentlyServed.find((turn) => turn.moduleId === moduleId);
      return serving;
   };

   const getNextInQueue = () => {
      return waitingTurns[0] || null;
   };

   const handleTakeModule = async (moduleId: string) => {
      await takeModule(moduleId);
   };

   const handleLeaveModule = async (moduleId: string) => {
      await leaveModule(moduleId);
   };

   return (
      <Container className="space-y-6">
         {/* Header */}
         <div className="relative">
            {user?.role === "admin" && <GoBackBtn />}
            <h1 className="text-2xl font-bold text-card-foreground mb-4 text-center">
               Panel de Gestión de Módulos
            </h1>
            <TimerWatch />
         </div>

         {/* Quick Stats */}
         <div className="bg-card rounded-md shadow p-6 border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-accent/50 shadow border p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">{stats?.waiting || 0}</div>
                  <div className="text-sm text-muted-foreground">En espera</div>
               </div>
               <div className="bg-accent/50 shadow border p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">{stats?.beingServed || 0}</div>
                  <div className="text-sm text-muted-foreground">Atendiéndose</div>
               </div>
               <div className="bg-accent/50 shadow border p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-primary">
                     {stats?.completed || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Completados</div>
               </div>
               <div className="bg-accent/50 shadow border p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-primary">
                     {stats?.totalToday || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Hoy</div>
               </div>
            </div>
         </div>

         {/* Siguientes en la cola */}
         {waitingTurns.length > 0 &&
            (() => {
               const last3 = waitingTurns.slice(0, 3).reverse();
               const next = waitingTurns[0];
               return (
                  <div className="bg-card border rounded-md shadow p-5 mb-6">
                     <div className="flex items-center gap-2 mb-4">
                        <Users className="text-muted-foreground" size={18} />
                        <span className="font-semibold text-card-foreground text-sm uppercase tracking-wide">
                           Últimos en la cola
                        </span>
                        <span className="ml-auto bg-blue-500 dark:bg-blue-600/50 text-white text-xs px-2 py-0.5 rounded-sm">
                           {waitingTurns.length} en espera
                        </span>
                     </div>
                     <div className="flex flex-col gap-2">
                        {last3.map((turn) => {
                           const isNext = turn.id === next.id;
                           return (
                              <div
                                 key={turn.id}
                                 className={`flex items-center justify-between rounded-md px-4 py-2.5 transition-all border ${
                                    isNext
                                       ? "bg-primary/10 border-primary/30 shadow-sm"
                                       : "bg-accent/40 border-grey/10 opacity-90"
                                 }`}
                              >
                                 <div className="flex items-center gap-3">
                                    {isNext && (
                                       <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                    <span
                                       className={`text-sm ${isNext ? "font-semibold text-card-foreground" : "text-muted-foreground"}`}
                                    >
                                       {turn.user.name}
                                    </span>
                                    <span
                                       className={`text-xs px-1.5 py-0.5 rounded font-mono ${isNext ? "bg-primary/20 text-primary" : "bg-accent text-muted-foreground"}`}
                                    >
                                       {turn.ticketCode}
                                    </span>
                                 </div>
                                 <span
                                    className={`text-sm font-medium px-2.5 py-1 rounded-sm ${
                                       isNext
                                          ? "bg-primary/20 text-primary"
                                          : "bg-accent text-muted-foreground"
                                    }`}
                                 >
                                    # {turn.serviceType}
                                 </span>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               );
            })()}

         {/* Main Content */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...modules]
               .sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }))
               .map((module) => {
                  const serving = getModuleStatus(module.id);
                  const isAvailable = !serving;
                  const canCallNext = isAvailable && waitingTurns.length > 0;

                  const isTakenByUser = module.currentAgent === user?.id;
                  const userHasModule = modules.some((m) => m.currentAgent === user?.id);
                  const shouldDisable = userHasModule && !isTakenByUser;

                  return (
                     <div
                        key={module.id}
                        className="bg-white dark:bg-card rounded-md shadow overflow-hidden flex flex-col justify-between"
                     >
                        {/* Encabezado del módulo */}
                        <div
                           className={`p-4 ${isAvailable ? "bg-blue-500 dark:bg-blue-600/50" : "bg-green-500 dark:bg-green-600/50"} text-white`}
                        >
                           <div className="flex items-center justify-between">
                              <h3 className="font-bold text-lg">{module.name}</h3>
                              <div
                                 className={`px-2 py-1 rounded text-xs font-medium ${
                                    isAvailable ? "bg-blue-600" : "bg-green-600"
                                 }`}
                              >
                                 {isAvailable ? "Disponible" : "Ocupado"}
                              </div>
                           </div>
                           {module.description && (
                              <p className="text-sm opacity-90 mt-1">
                                 {module.description}
                              </p>
                           )}
                        </div>

                        {/* Contenido del módulo */}
                        <div className="p-6">
                           {serving ? (
                              <div className="space-y-4">
                                 <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                       {serving.ticketCode}
                                    </div>
                                    <div className="font-medium">{serving.user.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                       ID: {serving.user.nationalId}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                       Servicio: {serving.serviceType ?? "-"}
                                    </div>
                                 </div>

                                 {module.currentAgent === user?.id && (
                                    <Button
                                       onClick={() => handleComplete(serving.id)}
                                       className="w-full"
                                    >
                                       <CheckCircle size={18} />
                                       Finalizar servicio
                                    </Button>
                                 )}

                                 <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <span>
                                       Iniciado:{" "}
                                       {new Date(serving.calledAt!).toLocaleTimeString(
                                          "es-CO",
                                          {
                                             hour: "numeric",
                                             minute: "numeric",
                                             hour12: true,
                                          },
                                       )}
                                    </span>
                                 </div>
                              </div>
                           ) : (
                              <div>
                                 <div className="text-center mb-4">
                                    <UserCheck
                                       size={48}
                                       className="mx-auto text-gray-400 dark:text-gray-600 mb-2"
                                    />
                                    <div className="text-gray-500 dark:text-gray-400">
                                       Listo para el siguiente cliente
                                    </div>
                                 </div>

                                 {module.currentAgent === user?.id && (
                                    <Button
                                       onClick={() => handleCallNext(module.id)}
                                       disabled={!canCallNext || shouldDisable}
                                       variant={shouldDisable ? "secondary" : "outline"}
                                       className="w-full mb-4"
                                    >
                                       {canCallNext ? (
                                          <Phone size={18} />
                                       ) : (
                                          <PhoneOff size={18} />
                                       )}
                                       {canCallNext
                                          ? "Llamar siguiente"
                                          : "Nadie en espera"}
                                    </Button>
                                 )}

                                 {canCallNext && getNextInQueue() && (
                                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                       Siguiente: {getNextInQueue()!.ticketCode} (
                                       {getNextInQueue()!.user.name})
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>

                        {/* Pie de módulo */}
                        <div className="p-4 bg-accent/50 border-t">
                           {module.agent ? (
                              <div className="flex items-center gap-2 justify-center">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 <div className="text-sm font-medium text-green-700 dark:text-green-400">
                                    {module.agent.name}
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-2">
                                 <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    - Sin agente asignado -
                                 </div>
                                 <Button
                                    variant={shouldDisable ? "outline" : "default"}
                                    onClick={() => handleTakeModule(module.id)}
                                    disabled={shouldDisable}
                                    className={`w-full ${!shouldDisable && "bg-blue-500 hover:bg-blue-400 text-white"}`}
                                 >
                                    <LogInIcon />
                                    Tomar módulo
                                 </Button>
                              </div>
                           )}

                           {module.agent && module.currentAgent === user?.id && (
                              <Button
                                 onClick={() => handleLeaveModule(module.id)}
                                 variant="destructive"
                                 className="w-full mt-2"
                              >
                                 <LogOut />
                                 Dejar módulo
                              </Button>
                           )}
                        </div>
                     </div>
                  );
               })}
         </div>
      </Container>
   );
};
