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
import { X, LoaderCircle, Package, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../../Modal";
import type { Module } from "@/types/queue";
import { useQueueStore } from "@/stores/useQueueStore";

type EditModuleProps = {
   handleModal: (modal: string) => void;
   module: Module;
};

const formSchema = z.object({
   name: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(50, { message: "Máximo 50 caracteres" })
      .optional()
      .or(z.literal("")),
   description: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(150, { message: "Máximo 150 caracteres" })
      .optional()
      .or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

export const EditModule = ({ handleModal, module }: EditModuleProps) => {
   const { isLoading, editModule, modules } = useQueueStore();

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: module.name,
         description: module.description,
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      if (values.name !== module.name) {
         const idExists = modules.find(
            (u) => u.name === values.name && u.id !== module.id,
         );

         if (idExists) {
            toast.info("Este nombre ya está en uso", {
               position: "top-left",
            });
            return;
         }
      }

      const updates: Record<string, string> = {};

      if (values.name && values.name !== module.name) updates.name = values.name;
      if (values.description && values.description !== module.description)
         updates.description = values.description;

      await editModule(module.id, updates);
      handleModal("");
   };

   return (
      <Modal orientation="right" onClose={() => handleModal("")}>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <div className="relative flex flex-col justify-between bg-background dark:bg-accent w-screen sm:w-lg h-full overflow-y-auto">
                  <div className="p-6 bg-accent border-b-1 sticky top-0 z-10">
                     <h1 className="text-2xl font-bold">Editar módulo</h1>
                     <p className="text-muted-foreground text-sm">
                        Completa la información para editar el módulo
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
                                       <Package
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
                           name="description"
                           disabled={isLoading}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Description</FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <MessageSquare
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
                        {isLoading ? "Guardando" : "Guardar"}
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
