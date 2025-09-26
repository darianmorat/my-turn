import { useEffect, useState } from "react";
import { useQueueStore } from "@/stores/useQueueStore";
import {
   UserCheck,
   CheckCircle,
   Users,
   Phone,
   Plus,
   X,
   RefreshCcw,
   Clock,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Container";

const moduleFormSchema = z.object({
   name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
   description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
});

type ModuleFormData = z.infer<typeof moduleFormSchema>;

export const ModuleDashboard = () => {
   const [activeModal, setActiveModal] = useState<"module" | null>(null);

   const {
      modules,
      currentlyServed,
      waitingTurns,
      stats,
      callNext,
      completeTurn,
      getCurrentlyServed,
      getModules,
      getWaitingTurns,
      getStats,
      createModule,
      isLoading,
   } = useQueueStore();

   const moduleForm = useForm<ModuleFormData>({
      resolver: zodResolver(moduleFormSchema),
      defaultValues: { name: "", description: "" },
   });

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

   const handleCallNext = async (moduleId: string) => {
      const turn = await callNext(moduleId);
      if (turn) {
         console.log(`Llamado ${turn.ticketCode} al Módulo ${moduleId}`);
      }
   };

   const handleComplete = async (turnId: string) => {
      await completeTurn(turnId);
   };

   const onCreateModule = async (data: ModuleFormData) => {
      await createModule(data.name, data.description);
      moduleForm.reset();
      setActiveModal(null);
   };

   const getModuleStatus = (moduleId: string) => {
      const serving = currentlyServed.find((turn) => turn.moduleId === moduleId);
      return serving;
   };

   const getNextInQueue = () => {
      return waitingTurns[0] || null;
   };

   const currentTime = new Date().toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
   });

   return (
      <Container className="space-y-6">
         {/* Encabezado */}
         <div>
            <h1 className="text-2xl font-bold text-card-foreground mb-4 text-center">
               Panel de Gestión de Módulos
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

         {/* Acciones rápidas */}
         <div className="rounded-md shadow p-6 border bg-card">
            <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
            <div className="flex flex-wrap gap-4">
               <Button onClick={() => setActiveModal("module")}>
                  <Plus size={18} />
                  Crear módulo
               </Button>
               <Button onClick={() => window.location.reload()} variant={"outline"}>
                  <RefreshCcw size={18} />
                  Refrescar todo
               </Button>

               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-refrescado cada 5 segundos</span>
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
                        Siguiente en la cola: {getNextInQueue()!.ticketCode}
                     </div>
                     <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        {getNextInQueue()!.user.name} - Posición #
                        {getNextInQueue()!.queueNumber}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Cuadrícula de módulos */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
               const serving = getModuleStatus(module.id);
               const isAvailable = !serving;
               const canCallNext = isAvailable && waitingTurns.length > 0;

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
                           <p className="text-sm opacity-90 mt-1">{module.description}</p>
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

                              <Button
                                 onClick={() => handleComplete(serving.id)}
                                 disabled={isLoading}
                                 className="w-full"
                              >
                                 <CheckCircle size={18} />
                                 Finalizar servicio
                              </Button>

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

                              <Button
                                 onClick={() => handleCallNext(module.id)}
                                 disabled={!canCallNext || isLoading}
                                 variant={"outline"}
                                 className="w-full mb-4"
                              >
                                 <Phone size={18} />
                                 {canCallNext ? "Llamar siguiente" : "Nadie en espera"}
                              </Button>

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
                     <div className="px-4 py-2 bg-accent/50 border-t">
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                           {module.agentName
                              ? `Agente: ${module.agentName}`
                              : "Sin agente asignado"}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Modal crear módulo */}
         {activeModal === "module" && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="relative p-6 rounded-xl shadow-lg w-96 max-w-[90vw] bg-white dark:bg-accent">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold">Crear módulo</h2>
                     <X
                        onClick={() => {
                           setActiveModal(null);
                           moduleForm.reset();
                        }}
                        className="cursor-pointer text-muted-foreground hover:text-gray-700"
                        size={20}
                     />
                  </div>

                  <form
                     onSubmit={moduleForm.handleSubmit(onCreateModule)}
                     className="space-y-4"
                  >
                     <div>
                        <label className="block text-sm font-medium mb-1">
                           Nombre del módulo
                        </label>
                        <input
                           {...moduleForm.register("name")}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="Ingrese el nombre del módulo"
                        />
                        {moduleForm.formState.errors.name && (
                           <p className="text-red-500 text-sm mt-1">
                              {moduleForm.formState.errors.name.message}
                           </p>
                        )}
                     </div>

                     <div>
                        <label className="block text-sm font-medium mb-1">
                           Descripción
                        </label>
                        <textarea
                           {...moduleForm.register("description")}
                           rows={3}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                           placeholder="Ingrese la descripción del módulo"
                        />
                        {moduleForm.formState.errors.description && (
                           <p className="text-red-500 text-sm mt-1">
                              {moduleForm.formState.errors.description.message}
                           </p>
                        )}
                     </div>

                     <Button type="submit" disabled={isLoading} className="w-full">
                        <Plus size={18} />
                        {isLoading ? "Creando..." : "Crear módulo"}
                     </Button>
                  </form>
               </div>
            </div>
         )}
      </Container>
   );
};
