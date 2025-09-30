import { Button } from "../../ui/button";
import { LoaderCircle, X } from "lucide-react";
import { Modal } from "../../Modal";
import { useUserStore } from "@/stores/useUserStore";
import type { User } from "@/types/user";

type DeleteUserProps = {
   handleModal: () => void;
   user: User;
};

export const DeleteUser = ({ handleModal, user }: DeleteUserProps) => {
   const { isLoading, deleteUser } = useUserStore();

   const handleDelete = async () => {
      await deleteUser(user.id);
      handleModal();
   };

   return (
      <Modal onClose={handleModal}>
         <div className="relative bg-background dark:bg-accent p-6 rounded-md m-4 w-full max-w-100 flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Eliminar usuario</h1>
            <p className="text-muted-foreground text-sm">
               Confirma que quiere eliminar el usuario{" "}
               <span className="font-bold">{user.name}</span>?
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
