import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useQueueStore } from "@/stores/useQueueStore";
import { X, UserPlus, Ticket, Search, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
      }, 10000); // 10s

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const onCreateUser = async (data: UserFormData) => {
      await createUser(data);
      userForm.reset();
      setActiveModal(null);
   };

   const onCreateTurn = async (data: TurnFormData) => {
      const turn = await createTurn(data.nationalId);
      if (turn) {
         turnForm.reset();
         setActiveModal(null);

         alert(
            `¡Turno creado exitosamente!\n\nTicket: ${turn.ticketCode}\nCliente: ${turn.user.name}\nPosición: #${turn.queueNumber}`,
         );
      }
   };

   const filteredUsers = users.filter(
      (user) =>
         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.nationalId.includes(searchTerm),
   );

   return (
      <div className="min-h-screen bg-gray-100 p-6">
         {/* Header */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
               <h1 className="text-2xl font-bold text-gray-800">Interfaz de Recepción</h1>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                     {stats?.waiting || 0}
                  </div>
                  <div className="text-sm text-blue-800">En espera</div>
               </div>
               <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                     {stats?.beingServed || 0}
                  </div>
                  <div className="text-sm text-green-800">Atendiéndose</div>
               </div>
               <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                     {stats?.completed || 0}
                  </div>
                  <div className="text-sm text-purple-800">Completados</div>
               </div>
               <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">
                     {stats?.totalToday || 0}
                  </div>
                  <div className="text-sm text-gray-800">Total Hoy</div>
               </div>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="flex flex-wrap gap-4 mb-6">
            <button
               onClick={() => setActiveModal("user")}
               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
               <UserPlus size={20} />
               Crear Usuario
            </button>

            <button
               onClick={() => setActiveModal("turn")}
               className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
               <Ticket size={20} />
               Asignar Turno
            </button>
         </div>

         {/* Main Content */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registered Users */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
               <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Users size={20} />
                        Usuarios Registrados ({users.length})
                     </h2>
                  </div>

                  <div className="relative">
                     <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                     />
                     <input
                        type="text"
                        placeholder="Buscar por nombre o cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>
               </div>

               <div className="max-h-96 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                     <div className="p-8 text-center text-gray-500">
                        {searchTerm
                           ? "No se encontraron usuarios que coincidan con la búsqueda"
                           : "Aún no hay usuarios registrados"}
                     </div>
                  ) : (
                     <div className="divide-y">
                        {filteredUsers.map((user) => (
                           <div
                              key={user.id}
                              className="p-4 hover:bg-gray-50 flex items-center justify-between"
                           >
                              <div>
                                 <div className="font-medium">{user.name}</div>
                                 <div className="text-sm text-gray-500">
                                    Cédula: {user.nationalId}
                                 </div>
                              </div>
                              <button
                                 onClick={() => {
                                    turnForm.setValue("nationalId", user.nationalId);
                                    setActiveModal("turn");
                                 }}
                                 className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                              >
                                 Asignar Turno
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Current Queue */}
            <div className="bg-white rounded-lg shadow-md">
               <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Cola Actual</h2>
               </div>

               <div className="max-h-96 overflow-y-auto">
                  {waitingTurns.length === 0 ? (
                     <div className="p-8 text-center text-gray-500">
                        No hay personas en la cola
                     </div>
                  ) : (
                     <div className="divide-y">
                        {waitingTurns.slice(0, 10).map((turn, index) => (
                           <div
                              key={turn.id}
                              className={`p-3 ${index === 0 ? "bg-yellow-50" : ""}`}
                           >
                              <div className="flex items-center justify-between">
                                 <div>
                                    <div className="font-bold text-blue-600">
                                       {turn.ticketCode}
                                    </div>
                                    <div className="text-sm font-medium">
                                       {turn.user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       #{turn.queueNumber}
                                    </div>
                                 </div>
                                 {index === 0 && (
                                    <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                                       SIGUIENTE
                                    </div>
                                 )}
                              </div>
                           </div>
                        ))}

                        {waitingTurns.length > 10 && (
                           <div className="p-3 text-center text-gray-500 text-sm">
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
               <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 max-w-[90vw]">
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
                           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="Ingrese número de cédula"
                        />
                        {userForm.formState.errors.nationalId && (
                           <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.nationalId.message}
                           </p>
                        )}
                     </div>

                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                     >
                        <UserPlus size={18} />
                        {isLoading ? "Creando..." : "Crear Usuario"}
                     </button>
                  </form>
               </div>
            </div>
         )}

         {/* Assign Turn Modal */}
         {activeModal === "turn" && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 max-w-[90vw]">
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
                           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                           placeholder="Ingrese la cédula del cliente"
                        />
                        {turnForm.formState.errors.nationalId && (
                           <p className="text-red-500 text-sm mt-1">
                              {turnForm.formState.errors.nationalId.message}
                           </p>
                        )}
                     </div>

                     <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm text-yellow-800">
                           <strong>Próximo ticket:</strong>{" "}
                           {stats?.nextTicket ||
                              `A${(stats?.totalToday || 0) + 1}`.padStart(4, "0")}
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                           Actualmente {stats?.waiting || 0} personas en espera en la cola
                        </div>
                     </div>

                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                     >
                        <Ticket size={18} />
                        {isLoading ? "Creando Turno..." : "Asignar Turno"}
                     </button>
                  </form>

                  <div className="mt-4 pt-4 border-t text-center">
                     <button
                        onClick={() => setActiveModal("user")}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                     >
                        ¿Cliente no registrado? Cree un nuevo usuario primero
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
