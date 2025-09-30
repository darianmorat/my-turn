import { z } from "zod";

export const formSchema = z.object({
   name: z
      .string()
      .min(4, { message: "Mínimo 4 caracteres" })
      .max(50, { message: "Máximo 50 caracteres" }),

   role: z.string().min(1, { message: "Role es requerido" }),

   email: z
      .email({ message: "Email inválido" })
      .max(255, { message: "Máximo 255 caracteres" }),

   password: z
      .string()
      .min(1, { message: "Contraseña inválida" })
      .max(60, { message: "Máximo 60 caracteres" }),
});

export type FormData = z.infer<typeof formSchema>;
