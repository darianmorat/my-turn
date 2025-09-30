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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { User, Mail, Lock, X, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../Modal";
import { usePersonalStore } from "@/stores/usePersonalStore";
import { type FormData, formSchema } from "./PersonalSchema";

type CreateUserProps = {
   handleModal: (modal: string) => void;
};

export const CreateUser = ({ handleModal }: CreateUserProps) => {
   const [showPassword, setShowPassword] = useState(false);
   const { isLoading, createUser } = usePersonalStore();

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         role: "agent",
         email: "",
         password: "",
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      await createUser(values.name, values.email, values.password, values.role);
      handleModal("");
   };

   const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
   };

   return (
      <Modal orientation="right" onClose={() => handleModal("")}>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <div className="relative flex flex-col justify-between bg-background dark:bg-accent w-screen sm:w-lg h-full overflow-y-auto">
                  <div className="p-6 bg-accent border-b-1 sticky top-0 z-10">
                     <h1 className="text-2xl font-bold">Crear usuario</h1>
                     <p className="text-muted-foreground text-sm">
                        Completa la información para crear una nueva cuenta
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
                                       <User
                                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                          size={18}
                                       />
                                       <Input
                                          placeholder="Jhon Smith"
                                          {...field}
                                          className="pl-10"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="role"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Tipo</FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Seleccionar rol de usuario" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-99">
                                       <SelectItem value="agent">Agente</SelectItem>
                                       <SelectItem value="receptionist">
                                          Recepcionista
                                       </SelectItem>
                                       <SelectItem value="admin">Manager</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="email"
                           disabled={isLoading}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Correo</FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <Mail
                                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                          size={18}
                                       />
                                       <Input
                                          placeholder="jhon@gmail.com"
                                          {...field}
                                          className="pl-10"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="password"
                           disabled={isLoading}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Contraseña</FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <Lock
                                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                          size={18}
                                       />
                                       <Input
                                          type={showPassword ? "text" : "password"}
                                          placeholder={
                                             showPassword ? "Contraseña" : "••••••••"
                                          }
                                          {...field}
                                          className="pl-10"
                                       />
                                       <Button
                                          type="button"
                                          variant={"ghost"}
                                          className="absolute right-0 top-0 text-muted-foreground"
                                          onClick={() => toggleShowPassword()}
                                          disabled={isLoading}
                                       >
                                          {showPassword ? <Eye /> : <EyeOff />}
                                       </Button>
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
                        {isLoading ? "Creando" : "Crear"}
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
