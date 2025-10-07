import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useQueueStore } from "@/stores/useQueueStore";
import { X, UserPlus, Search, Users, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Container";
import { TimerWatch } from "@/components/TimerWatch";
import { Modal } from "@/components/Modal";
import type { User } from "@/types/user";
import type { Turn } from "@/types/queue";
import { GoBackBtn } from "@/components/GoBackBtn";
import { useAuthStore } from "@/stores/useAuthStore";

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
   const [showModal, setShowModal] = useState({ active: false, for: "" });
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
   const [searchTerm, setSearchTerm] = useState("");

   const { user } = useAuthStore();
   const { isLoading: isUserLoading, users, getUsers, createUser } = useUserStore();
   const {
      waitingTurns,
      stats,
      createTurn,
      cancelTurn,
      getWaitingTurns,
      getStats,
      isLoading,
   } = useQueueStore();

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
      handleModal("");
   };

   const onCreateTurn = async (data: TurnFormData) => {
      const turn = await createTurn(data.nationalId);

      if (turn) {
         handleModal("");
      }
   };

   const filteredUsers = users.filter(
      (user) =>
         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.nationalId.includes(searchTerm),
   );

   const handleModal = (modal: string): void => {
      setShowModal((prev) => ({ active: !prev.active, for: modal }));
   };

   const handleCancelTurn = async () => {
      if (!selectedTurn) return;

      await cancelTurn(selectedTurn.id);
      handleModal("");
      setSelectedTurn(null);
   };

   return (
      <Container className="space-y-6">
         {/* Header */}
         <div>
            {user?.role === "admin" && <GoBackBtn />}
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
               <Button onClick={() => handleModal("user")}>
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
                                    handleModal("turn");
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
                                 <div className="flex items-center gap-2">
                                    {index === 0 && (
                                       <div className="bg-warning text-warning-foreground px-2 py-1 rounded text-xs font-bold">
                                          SIGUIENTE
                                       </div>
                                    )}
                                    <Button
                                       onClick={() => {
                                          handleModal("cancel");
                                          setSelectedUser(turn.user);
                                          setSelectedTurn(turn);
                                       }}
                                       variant="ghost"
                                       size="icon"
                                       className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                       <X size={16} />
                                    </Button>
                                 </div>
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
         {showModal.active && showModal.for === "user" && (
            <Modal onClose={() => handleModal("")}>
               <div className="relative bg-white dark:bg-accent p-6 rounded-xl shadow-lg w-96 max-w-[90vw]">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold">Nuevo Usuario</h2>
                     <X
                        onClick={() => handleModal("")}
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

                     <Button type="submit" disabled={isUserLoading} className="w-full">
                        {isUserLoading && <LoaderCircle className="animate-spin" />}
                        {isUserLoading ? "Guardando..." : "Guardar"}
                     </Button>
                  </form>
               </div>
            </Modal>
         )}

         {/* Assign Turn Modal */}
         {showModal.active && showModal.for === "turn" && (
            <Modal onClose={() => handleModal("")}>
               <div className="relative bg-white dark:bg-accent p-6 rounded-xl shadow-lg w-96 max-w-[90vw]">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold">Nuevo turno</h2>
                     <X
                        onClick={() => handleModal("")}
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
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        {isLoading ? "Guardando..." : "Guardar"}
                     </Button>
                  </form>
               </div>
            </Modal>
         )}

         {/* Cancel Turn Modal */}
         {showModal.active && showModal.for === "cancel" && (
            <Modal onClose={() => handleModal("")}>
               <div className="relative bg-background dark:bg-accent p-6 rounded-md m-4 w-full max-w-100 flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">Cancelar Turno</h1>
                  <p className="text-muted-foreground text-sm">
                     Confirma que quiere cancelar el turno para el usuario:
                  </p>
                  <div className="flex flex-col gap-0">
                     <p className="text-muted-foreground text-sm">
                        Nombre: <span className="font-bold">{selectedUser?.name}</span>
                     </p>
                     <p className="text-muted-foreground text-sm">
                        ID: <span className="font-bold">{selectedUser?.nationalId}</span>
                     </p>
                  </div>
                  <Button
                     type="button"
                     variant={"ghost"}
                     className="absolute right-2 top-2 text-muted-foreground"
                     onClick={() => handleModal("")}
                  >
                     <X />
                  </Button>
                  <div className="flex gap-2 pt-2">
                     <Button
                        variant={"default"}
                        type="submit"
                        onClick={() => handleCancelTurn()}
                        disabled={isLoading}
                        className="flex-1/2"
                     >
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        {isLoading ? "Cancelando" : "Aceptar"}
                     </Button>
                     <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => handleModal("")}
                        disabled={isLoading}
                        className="flex-1/2"
                     >
                        Cancelar
                     </Button>
                  </div>
               </div>
            </Modal>
         )}
      </Container>
   );
};
