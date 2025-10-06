import { useEffect } from "react";
import { useQueueStore } from "@/stores/useQueueStore";
import { UserCheck, CheckCircle, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Container";
import { TimerWatch } from "@/components/TimerWatch";
import { useAuthStore } from "@/stores/useAuthStore";

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
      isLoading,
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
      const turn = await callNext(moduleId);
      if (turn) {
         console.log(`Llamado ${turn.ticketCode} al Módulo ${moduleId}`);
      }
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
         <div>
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

         {/* Siguiente en la cola */}
         {getNextInQueue() && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 mb-6">
               <div className="flex items-center gap-3">
                  <Users className="text-yellow-600 dark:text-yellow-400" size={24} />
                  <div>
                     <div className="font-semibold text-yellow-800 dark:text-yellow-300">
                        Siguiente en la cola:
                     </div>
                     <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        {getNextInQueue()!.user.name} - {getNextInQueue()!.ticketCode}
                     </div>
                  </div>
               </div>
            </div>
         )}

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
                           className={`p-4 ${isAvailable ? "bg-blue-500" : "bg-green-500"} text-white`}
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
                                 </div>

                                 {module.currentAgent === user?.id && (
                                    <Button
                                       onClick={() => handleComplete(serving.id)}
                                       disabled={isLoading}
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
                                       disabled={
                                          !canCallNext || isLoading || shouldDisable
                                       }
                                       variant={shouldDisable ? "secondary" : "outline"}
                                       className="w-full mb-4"
                                    >
                                       <Phone size={18} />
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
                                    className="w-full bg-blue-500 hover:bg-blue-400"
                                    size="sm"
                                 >
                                    Tomar módulo
                                 </Button>
                              </div>
                           )}

                           {module.agent && module.currentAgent === user?.id && (
                              <Button
                                 onClick={() => handleLeaveModule(module.id)}
                                 variant="destructive"
                                 className="w-full mt-2"
                                 size="sm"
                              >
                                 Abandonar módulo
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
