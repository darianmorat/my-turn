import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useQueueStore } from "@/stores/useQueueStore";
import { X, UserPlus, Ticket, Search, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Container";
import { TimerWatch } from "@/components/TimerWatch";

const userFormSchema = z.object({
   name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
   nationalId: z.string().min(5, "La cédula debe tener al menos 5 caracteres"),
});

const turnFormSchema = z.object({
   nationalId: z.string().min(5, "La cédula debe tener al menos 5 caracteres"),
});

type UserFormData = z.infer<typeof userFormSchema>;
type TurnFormData = z.infer<typeof turnFormSchema>;

export const ReceptionInterface = () => {
   const [activeModal, setActiveModal] = useState<"user" | "turn" | null>(null);
   const [searchTerm, setSearchTerm] = useState("");

   const { users, getUsers, createUser } = useUserStore();
   const { waitingTurns, stats, createTurn, getWaitingTurns, getStats, isLoading } =
      useQueueStore();

   const userForm = useForm<UserFormData>({
      resolver: zodResolver(userFormSchema),
      defaultValues: { name: "", nationalId: "" },
   });

   const turnForm = useForm<TurnFormData>({
      resolver: zodResolver(turnFormSchema),
      defaultValues: { nationalId: "" },
   });

   useEffect(() => {
      getUsers();
      getWaitingTurns();
      getStats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      const interval = setInterval(() => {
         getStats();
         getWaitingTurns();
      }, 5000); // 5s

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const onCreateUser = async (data: UserFormData) => {
      await createUser(data.name, data.nationalId);
      userForm.reset();
      setActiveModal(null);
   };

   const onCreateTurn = async (data: TurnFormData) => {
      const turn = await createTurn(data.nationalId);
      if (turn) {
         turnForm.reset();
         setActiveModal(null);
         alert("Turno creado exitosamente"); // we should show the store msg, not this one
      }
   };

   const filteredUsers = users.filter(
      (user) =>
         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.nationalId.includes(searchTerm),
   );

   return (
      <Container className="space-y-6">
         {/* Header */}
         <div>
            <h1 className="text-2xl font-bold text-card-foreground mb-4 text-center">
               Interfaz de Recepción
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

         {/* Action Buttons */}
         <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
               <Button onClick={() => setActiveModal("user")}>
                  <UserPlus size={20} />
                  Crear Usuario
               </Button>
               {/* <Button onClick={() => setActiveModal("turn")} variant={"outline"}> */}
               {/*    <Ticket size={20} /> */}
               {/*    Asignar Turno */}
               {/* </Button> */}
            </div>
            {/* <Button variant={"outline"} onClick={() => console.log("excel export")}> */}
            {/*    <ExternalLink size={20} /> */}
            {/*    Exportar record */}
            {/* </Button> */}
         </div>

         {/* Main Content */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registered Users */}
            <div className="lg:col-span-2 bg-card rounded-md shadow border">
               <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
                        <Users size={20} />
                        Usuarios Registrados ({users.length})
                     </h2>
                  </div>

                  <div className="relative">
                     <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                     />
                     <input
                        type="text"
                        placeholder="Buscar por nombre o cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                     />
                  </div>
               </div>

               <div className="max-h-96 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                     <div className="p-8 text-center text-muted-foreground">
                        {searchTerm
                           ? "No se encontraron usuarios que coincidan con la búsqueda"
                           : "Aún no hay usuarios registrados"}
                     </div>
                  ) : (
                     <div className="divide-y divide-border">
                        {/* PENDING: */}
                        {/* Here is needed pagination if the app escalates, since it would */}
                        {/* show every single person listed, we should use pagination */}

                        {filteredUsers.map((user) => (
                           <div
                              key={user.id}
                              className="p-4 hover:bg-muted flex items-center justify-between"
                           >
                              <div>
                                 <div className="font-medium text-foreground">
                                    {user.name}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    Cédula: {user.nationalId}
                                 </div>
                              </div>
                              <Button
                                 onClick={() => {
                                    turnForm.setValue("nationalId", user.nationalId);
                                    setActiveModal("turn");
                                 }}
                                 variant={"outline"}
                              >
                                 Asignar Turno
                              </Button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Current Queue */}
            <div className="bg-card rounded-md shadow border">
               <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-card-foreground">
                     Cola Actual
                  </h2>
               </div>

               <div className="max-h-96 overflow-y-auto">
                  {waitingTurns.length === 0 ? (
                     <div className="p-8 text-center text-muted-foreground">
                        No hay personas en la cola
                     </div>
                  ) : (
                     <div className="divide-y divide-border">
                        {waitingTurns.slice(0, 10).map((turn, index) => (
                           <div
                              key={turn.id}
                              className={`p-3 ${index === 0 ? "bg-accent/50" : ""}`}
                           >
                              <div className="flex items-center justify-between">
                                 <div>
                                    <div className="font-bold text-primary">
                                       {turn.ticketCode}
                                    </div>
                                    <div className="text-sm font-medium text-foreground">
                                       {turn.user.name}
                                    </div>
                                 </div>
                                 {index === 0 && (
                                    <div className="bg-warning text-warning-foreground px-2 py-1 rounded text-xs font-bold">
                                       SIGUIENTE
                                    </div>
                                 )}
                              </div>
                           </div>
                        ))}

                        {waitingTurns.length > 10 && (
                           <div className="p-3 text-center text-muted-foreground text-sm">
                              +{waitingTurns.length - 10} más en espera...
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Create User Modal */}
         {activeModal === "user" && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="relative bg-white dark:bg-accent p-6 rounded-xl shadow-lg w-96 max-w-[90vw]">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold">Crear Usuario</h2>
                     <X
                        onClick={() => {
                           setActiveModal(null);
                           userForm.reset();
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        size={20}
                     />
                  </div>

                  <form
                     onSubmit={userForm.handleSubmit(onCreateUser)}
                     className="space-y-4"
                  >
                     <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                           {...userForm.register("name")}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="Ingrese nombre completo"
                        />
                        {userForm.formState.errors.name && (
                           <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.name.message}
                           </p>
                        )}
                     </div>

                     <div>
                        <label className="block text-sm font-medium mb-1">Cédula</label>
                        <input
                           {...userForm.register("nationalId")}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="Ingrese número de cédula"
                        />
                        {userForm.formState.errors.nationalId && (
                           <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.nationalId.message}
                           </p>
                        )}
                     </div>

                     <Button type="submit" disabled={isLoading} className="w-full">
                        <UserPlus size={18} />
                        {isLoading ? "Creando..." : "Crear Usuario"}
                     </Button>
                  </form>
               </div>
            </div>
         )}

         {/* Assign Turn Modal */}
         {activeModal === "turn" && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="relative bg-white dark:bg-accent p-6 rounded-xl shadow-lg w-96 max-w-[90vw]">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold">Asignar Turno</h2>
                     <X
                        onClick={() => {
                           setActiveModal(null);
                           turnForm.reset();
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        size={20}
                     />
                  </div>

                  <form
                     onSubmit={turnForm.handleSubmit(onCreateTurn)}
                     className="space-y-4"
                  >
                     <div>
                        <label className="block text-sm font-medium mb-1">Cédula</label>
                        <input
                           {...turnForm.register("nationalId")}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                           placeholder="Ingrese la cédula del cliente"
                        />
                        {turnForm.formState.errors.nationalId && (
                           <p className="text-red-500 text-sm mt-1">
                              {turnForm.formState.errors.nationalId.message}
                           </p>
                        )}
                     </div>

                     <Button type="submit" disabled={isLoading} className="w-full">
                        <Ticket size={18} />
                        {isLoading ? "Creando Turno..." : "Asignar Turno"}
                     </Button>
                  </form>

                  <div className="mt-4 pt-4 border-t text-center text-sm">
                     ¿No esta registrado?{" "}
                     <button
                        onClick={() => setActiveModal("user")}
                        className="text-blue-500 hover:text-blue-700 font-medium hover:underline"
                     >
                        Crear usuario
                     </button>
                  </div>
               </div>
            </div>
         )}
      </Container>
   );
};
