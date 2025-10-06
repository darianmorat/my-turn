import { Request, Response } from "express";
import { jwtGenerator } from "../utils/jwtGenerator";
import { clearCookie, setCookie } from "../utils/setCookie";
import { AuthRequest } from "../types/auth";
import { compare } from "bcrypt-ts";
import { personalService } from "../services/personal.service";

export const authenticate = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body;
      const user = await personalService.findForAuth(email);

      if (!user) {
         res.status(401).json({
            success: false,
            message: "Credenciales invalidas",
         });

         return;
      }

      if (!password) return;

      const hash = user.password;
      const isValid = await compare(password, hash);

      if (!isValid) {
         res.status(401).json({
            success: false,
            message: "Credenciales invalidas",
         });

         return;
      }

      const token = jwtGenerator(user.id);
      setCookie(res, token);

      res.status(200).json({
         success: true,
         message: "Autenticación exitosa",
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const logout = (_req: Request, res: Response) => {
   try {
      clearCookie(res);

      res.status(200).json({
         success: true,
         message: "Sesión cerrada",
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const verify = async (req: AuthRequest, res: Response) => {
   const { userId } = req.user;
   const user = await personalService.findById(userId);

   if (!userId) {
      res.status(401).json({
         success: false,
         message: "Acceso no autorizado",
      });

      return;
   }

   res.status(200).json({
      success: true,
      user: user,
   });
};
