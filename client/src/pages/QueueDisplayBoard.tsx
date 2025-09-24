import { useEffect } from "react";
import { Clock, Users, ArrowRight } from "lucide-react";
import { useQueueStore } from "@/stores/useQueueStore";
import { Container } from "@/components/Container";

export const QueueDisplayBoard = () => {
   const {
      waitingTurns,
      currentlyServed,
      modules,
      stats,
      getWaitingTurns,
      getCurrentlyServed,
      getModules,
      getStats,
   } = useQueueStore();

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
      const interval = setInterval(fetchData, 5000);

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const getNextTurnsWithModules = () => {
      const availableModules = modules.filter((m) => m.isActive);
      const busyModuleIds = currentlyServed.map((t) => t.moduleId).filter(Boolean);
      const availableModuleIds = availableModules
         .filter((m) => !busyModuleIds.includes(m.id))
         .map((m) => m.id);

      return waitingTurns.slice(0, 3).map((turn, index) => {
         let predictedModule = null;

         if (index === 0 && availableModuleIds.length > 0) {
            predictedModule = availableModules.find(
               (m) => m.id === availableModuleIds[0],
            );
         } else if (index < availableModuleIds.length) {
            predictedModule = availableModules.find(
               (m) => m.id === availableModuleIds[index],
            );
         }
         return { ...turn, predictedModule };
      });
   };

   const nextTurns = getNextTurnsWithModules();
   const currentTime = new Date().toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
   });

   return (
      <Container>
         <div className="min-h-screen">
            {/* Header */}
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-card-foreground mb-4 text-center">
                  Sistema de Gestión de Turnos
               </h1>
               <div className="flex items-center justify-center gap-12 text-muted-foreground">
                  <div className="flex items-center gap-2">
                     <Clock size={20} />
                     <span>{currentTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Users size={20} />
                     <span>{stats?.waiting || 0} en espera</span>
                  </div>
               </div>
            </div>

            {/* Actualmente Atendidos */}
            <div className="bg-card rounded-md shadow p-6 mb-6 border">
               <h2 className="text-lg font-semibold mb-6 text-card-foreground">
                  Actualmente Atendidos:
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {modules.map((module) => {
                     const serving = currentlyServed.find(
                        (t) => t.moduleId === module.id,
                     );
                     return (
                        <div
                           key={module.id}
                           className={`p-4 rounded-md border shadow text-center ${
                              serving
                                 ? "bg-green-600/20 dark:bg-green-600/40 border-green-500 animate-pulse"
                                 : "bg-muted border-border"
                           }`}
                        >
                           <h3 className="text-base font-bold text-card-foreground mb-2">
                              {module.name}
                           </h3>
                           {serving ? (
                              <>
                                 <div className="text-2xl font-bold text-primary mb-1">
                                    {serving.ticketCode}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    {serving.user.name}
                                 </div>
                                 <div className="text-xs text-muted-foreground mt-1">
                                    Desde{" "}
                                    {new Date(serving.calledAt!).toLocaleTimeString(
                                       "es-CO",
                                       {
                                          hour: "numeric",
                                          minute: "numeric",
                                          hour12: true,
                                       },
                                    )}
                                 </div>
                              </>
                           ) : (
                              <div className="text-muted-foreground">
                                 <div className="text-lg mb-1">Disponible</div>
                                 <div className="text-sm">
                                    Esperando al siguiente usuario
                                 </div>
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Próximos en la Cola */}
            <div className="bg-card rounded-md shadow p-6 mb-6 border">
               <h2 className="text-lg font-semibold mb-6 text-card-foreground">
                  Próximos a Ser Llamados:
               </h2>

               {nextTurns.length === 0 ? (
                  <div className="text-center py-12 bg-muted rounded-xl text-muted-foreground">
                     No hay personas en la cola
                  </div>
               ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {nextTurns.map((turn, index) => (
                        <div
                           key={turn.id}
                           className={`relative p-6 rounded-md shadow border ${
                              index === 0
                                 ? "bg-accent scale-[1.02]"
                                 : "bg-muted"
                           }`}
                        >
                           {index === 0 && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-md border text-xs font-bold bg-accent">
                                 SIGUIENTE
                              </div>
                           )}
                           <div className="text-center">
                              <div className="text-2xl font-bold text-primary mb-2">
                                 {turn.ticketCode}
                              </div>
                              <div className="text-base text-card-foreground mb-2">
                                 {turn.user.name}
                              </div>
                              <div className="text-sm text-muted-foreground mb-3">
                                 Posición: #{turn.queueNumber}
                              </div>

                              {turn.predictedModule ? (
                                 <div className="flex items-center justify-center gap-2 bg-muted rounded-md p-2 text-sm text-muted-foreground">
                                    <ArrowRight size={16} />
                                    <span className="font-semibold">
                                       {turn.predictedModule.name}
                                    </span>
                                 </div>
                              ) : (
                                 <div className="bg-muted rounded-md p-2 text-sm text-muted-foreground">
                                    Esperando un módulo disponible
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Estadísticas */}
            {stats && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-md text-center shadow border">
                     <div className="text-2xl font-bold text-primary">
                        {stats.waiting}
                     </div>
                     <div className="text-sm text-muted-foreground">En espera</div>
                  </div>
                  <div className="bg-card p-4 rounded-md text-center shadow border">
                     <div className="text-2xl font-bold text-success">
                        {stats.beingServed}
                     </div>
                     <div className="text-sm text-muted-foreground">En atención</div>
                  </div>
                  <div className="bg-card p-4 rounded-md text-center shadow border">
                     <div className="text-2xl font-bold text-purple-500">
                        {stats.completed}
                     </div>
                     <div className="text-sm text-muted-foreground">Completados</div>
                  </div>
                  <div className="bg-card p-4 rounded-md text-center shadow border">
                     <div className="text-2xl font-bold text-foreground">
                        {stats.totalToday}
                     </div>
                     <div className="text-sm text-muted-foreground">Total de Hoy</div>
                  </div>
               </div>
            )}
         </div>
      </Container>
   );
};
