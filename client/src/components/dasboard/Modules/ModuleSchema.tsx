import { z } from "zod";

export const formSchema = z.object({
   name: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(50, { message: "Máximo 50 caracteres" }),

   description: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(150, { message: "Máximo 150 caracteres" }),
});

export type FormData = z.infer<typeof formSchema>;
