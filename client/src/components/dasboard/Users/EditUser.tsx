import { z } from "zod";
import { Button } from "../../ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { X, LoaderCircle, User2, IdCard } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../../Modal";
import type { User } from "@/types/user";
import { useUserStore } from "@/stores/useUserStore";

type EditUserProps = {
   handleModal: (modal: string) => void;
   user: User;
};

const formSchema = z.object({
   name: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(50, { message: "Máximo 50 caracteres" })
      .optional()
      .or(z.literal("")),
   nationalId: z
      .string()
      .min(8, { message: "ID es requerido" })
      .optional()
      .or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

export const EditUser = ({ handleModal, user }: EditUserProps) => {
   const { isLoading, editUser, users } = useUserStore();

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: user.name,
         nationalId: user.nationalId,
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      if (values.nationalId !== user.nationalId) {
         const idExists = users.find(
            (u) => u.nationalId === values.nationalId && u.id !== user.id,
         );
         if (idExists) {
            toast.info("Este ID ya está en uso", {
               position: "top-left",
            });
            return;
         }
      }

      const updates: Record<string, string> = {};

      if (values.name && values.name !== user.name) updates.name = values.name;
      if (values.nationalId && values.nationalId !== user.nationalId)
         updates.nationalId = values.nationalId;

      await editUser(user.id, updates);
      handleModal("");
   };

   return (
      <Modal orientation="right" onClose={() => handleModal("")}>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <div className="relative flex flex-col justify-between bg-background dark:bg-accent w-screen sm:w-lg h-full overflow-y-auto">
                  <div className="p-6 bg-accent border-b-1 sticky top-0 z-10">
                     <h1 className="text-2xl font-bold">Editar usuario</h1>
                     <p className="text-muted-foreground text-sm">
                        Completa la información para editar la cuenta
                     </p>
                     <Button
                        type="button"
                        variant={"ghost"}
                        className="absolute right-2 top-2 text-muted-foreground"
                        onClick={() => handleModal("")}
                     >
                        <X />
                     </Button>
                  </div>
                  <div className="p-6 flex-1">
                     <div className="grid gap-4">
                        <FormField
                           control={form.control}
                           name="name"
                           disabled={isLoading}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Nombre</FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <User2
                                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                          size={18}
                                       />
                                       <Input {...field} className="pl-10" />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="nationalId"
                           disabled={isLoading}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>ID</FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <IdCard
                                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                          size={18}
                                       />
                                       <Input
                                          placeholder="111 111 111"
                                          {...field}
                                          className="pl-10"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>
                  <div className="flex bg-accent border-t-1 gap-2 p-6 sticky bottom-0 w-full">
                     <Button
                        variant={"default"}
                        type="submit"
                        disabled={isLoading}
                        className="flex-1/2"
                     >
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        {isLoading ? "Editando" : "Editar"}
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
            </form>
         </Form>
      </Modal>
   );
};
