import { PencilLine, Plus, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { CreateUser } from "./CreateUser";
import { DeleteUser } from "./DeleteUser";
import { formatDate } from "@/utils/format-date";
import { EditUser } from "./EditUser";
import type { User } from "@/types/user";
import { useUserStore } from "@/stores/useUserStore";

export const UserSection = () => {
   const [showModal, setShowModal] = useState({ active: false, for: "" });
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const { users = [], getUsers } = useUserStore();

   const handleModal = (modal: string): void => {
      setShowModal((prev) => ({ active: !prev.active, for: modal }));
   };

   useEffect(() => {
      getUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <div className="flex gap-4 items-center justify-between bg-card rounded-md shadow p-6 border mb-6">
            <div className="flex gap-8">
               <div>
                  <p className="text-3xl font-bold">
                     {users.length.toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm">Total Users</p>
               </div>
            </div>
            <Button onClick={() => handleModal("create")}>
               <Plus /> Crear usuario
            </Button>
         </div>

         <div className="overflow-x-auto bg-card rounded-md shadow border">
            <table className="min-w-full text-left">
               <thead className="bg-accent uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3 min-w-fit border-r text-left">Usuario</th>
                     <th className="px-6 py-3 min-w-fit border-r text-center">
                        Creación
                     </th>
                     <th className="px-6 py-3 min-w-sm text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {users.length === 0 && (
                     <tr>
                        <td colSpan={4} className="text-center py-6">
                           No hay usuarios para mostrar
                        </td>
                     </tr>
                  )}
                  {users.map((user) => (
                     <tr key={user.id}>
                        <td className="px-6 py-4 border-r">
                           <div className="font-medium">{user.name}</div>
                           <div className="text-sm text-gray-500 max-w-70 truncate">
                              {user.nationalId}
                           </div>
                        </td>
                        <td className="px-6 py-4 border-r text-center">
                           <span className="inline-block text-sm whitespace-nowrap w-30">
                              {formatDate(user.createdAt)}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button
                                 variant="outline"
                                 onClick={() => {
                                    handleModal("edit");
                                    setSelectedUser(user);
                                 }}
                              >
                                 <PencilLine />
                              </Button>
                              {/* <Button */}
                              {/*    variant="outline" */}
                              {/*    onClick={() => navigate(`/${user.username}`)} */}
                              {/* > */}
                              {/*    <Eye /> Ver perfil */}
                              {/* </Button> */}
                              <Button
                                 variant="outline"
                                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                 onClick={() => {
                                    handleModal("delete");
                                    setSelectedUser(user);
                                 }}
                              >
                                 <Trash />
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {showModal.active && showModal.for === "create" && (
            <CreateUser handleModal={() => handleModal("")} />
         )}
         {showModal.active && showModal.for === "delete" && selectedUser && (
            <DeleteUser handleModal={() => handleModal("")} user={selectedUser} />
         )}
         {showModal.active && showModal.for === "edit" && selectedUser && (
            <EditUser handleModal={() => handleModal("")} user={selectedUser} />
         )}
      </>
   );
};
