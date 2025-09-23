import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useTurnStore } from "@/stores/useTurnStore";

type FormProps = {
   closeModal: () => void;
};

const formSchema = z.object({
   nationalId: z.string().min(5, {
      message: "ID must be at least 5 characters.",
   }),
});

export const AssignTurnForm = ({ closeModal }: FormProps) => {
   const { createTurn } = useTurnStore();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         nationalId: "",
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      await createTurn(values);
      // closeModal();
   };

   return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
         <div className="relative bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Assign Turn</h2>
            <X
               onClick={() => closeModal()}
               className="absolute right-0 top-0 m-3 cursor-pointer"
            />
            <div>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="nationalId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>National ID</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button type="submit">Submit</Button>
                  </form>
               </Form>
            </div>
         </div>
      </div>
   );
};
