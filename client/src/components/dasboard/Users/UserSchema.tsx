import { z } from "zod";

export const formSchema = z.object({
   name: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(50, { message: "Máximo 50 caracteres" }),

   nationalId: z
      .string()
      .min(8, { message: "Mínimo 8 caracteres" })
      .max(8, { message: "Máximo 8 caracteres" }),
});

export type FormData = z.infer<typeof formSchema>;
