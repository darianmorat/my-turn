import { PencilLine, Plus, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import type { Module } from "@/types/queue";
import { useQueueStore } from "@/stores/useQueueStore";
import { CreateModule } from "./CreateModule";
import { DeleteModule } from "./DeleteModule";
import { EditModule } from "./EditModule";

export const ModuleSection = () => {
   const [showModal, setShowModal] = useState({ active: false, for: "" });
   const [selectedModule, setSelectedModule] = useState<Module | null>(null);
   const { modules, getModules } = useQueueStore();

   const handleModal = (modal: string): void => {
      setShowModal((prev) => ({ active: !prev.active, for: modal }));
   };

   useEffect(() => {
      getModules();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <div className="flex gap-4 items-center justify-between bg-card rounded-md shadow p-6 border mb-6">
            <div className="flex gap-8">
               <div>
                  <p className="text-3xl font-bold">
                     {modules.length.toString().padStart(2, "0")}
                  </p>
                  <p className="text-sm">Total Modulos</p>
               </div>
            </div>
            <Button onClick={() => handleModal("create")}>
               <Plus /> Crear Modulo
            </Button>
         </div>

         <div className="overflow-x-auto bg-card rounded-md shadow border">
            <table className="min-w-full text-left">
               <thead className="bg-accent uppercase text-xs">
                  <tr>
                     <th className="px-6 py-3 min-w-fit border-r text-left">Nombre</th>
                     <th className="px-6 py-3 min-w-fit border-r text-center">
                        Descripción
                     </th>
                     <th className="px-6 py-3 min-w-sm text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {modules.length === 0 && (
                     <tr>
                        <td colSpan={4} className="text-center py-6">
                           No hay módulos para mostrar
                        </td>
                     </tr>
                  )}
                  {modules.map((module) => (
                     <tr key={module.id}>
                        <td className="px-6 py-4 border-r">
                           <div className="font-medium">{module.name}</div>
                        </td>
                        <td className="px-6 py-4 border-r text-center">
                           <span className="inline-block text-sm whitespace-nowrap w-30">
                              {module.description}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button
                                 variant="outline"
                                 onClick={() => {
                                    handleModal("edit");
                                    setSelectedModule(module);
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
                                    setSelectedModule(module);
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
            <CreateModule handleModal={() => handleModal("")} />
         )}
         {showModal.active && showModal.for === "edit" && selectedModule && (
            <EditModule handleModal={() => handleModal("")} module={selectedModule} />
         )}
         {showModal.active && showModal.for === "delete" && selectedModule && (
            <DeleteModule handleModal={() => handleModal("")} module={selectedModule} />
         )}
      </>
   );
};
