import { Button } from "../../ui/button";
import { LoaderCircle, X } from "lucide-react";
import { Modal } from "../../Modal";
import { useQueueStore } from "@/stores/useQueueStore";
import type { Module } from "@/types/queue";

type DeleteModuleProps = {
   handleModal: () => void;
   module: Module;
};

export const DeleteModule = ({ handleModal, module }: DeleteModuleProps) => {
   const { isLoading, deleteModule } = useQueueStore();

   const handleDelete = async () => {
      await deleteModule(module.id);
      handleModal();
   };

   return (
      <Modal onClose={handleModal}>
         <div className="relative bg-background dark:bg-accent p-6 rounded-md m-4 w-full max-w-100 flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Eliminar módulo</h1>
            <p className="text-muted-foreground text-sm">
               Confirma que quiere eliminar {" "}
               <span className="font-bold">{module.name}</span>?
            </p>
            <Button
               type="button"
               variant={"ghost"}
               className="absolute right-2 top-2 text-muted-foreground"
               onClick={() => handleModal()}
            >
               <X />
            </Button>
            <div className="flex gap-2 pt-2">
               <Button
                  variant={"default"}
                  type="submit"
                  onClick={() => handleDelete()}
                  disabled={isLoading}
                  className="flex-1/2"
               >
                  {isLoading && <LoaderCircle className="animate-spin" />}
                  {isLoading ? "Eliminando" : "Aceptar"}
               </Button>
               <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => handleModal()}
                  disabled={isLoading}
                  className="flex-1/2"
               >
                  Cancelar
               </Button>
            </div>
         </div>
      </Modal>
   );
};
