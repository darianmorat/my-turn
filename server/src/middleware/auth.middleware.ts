import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { clearCookie } from "../utils/setCookie";
import { AuthRequest } from "../types/auth";

export const privateRoute = (req: AuthRequest, res: Response, next: NextFunction) => {
   try {
      const authCookie = req.cookies["auth"];
      const flagCookie = req.cookies["flag"];

      if (!authCookie || !flagCookie) {
         res.status(401).json({
            success: false,
            message: "Acceso no autorizado",
         });

         return;
      }

      const decoded = jwt.verify(authCookie, process.env.JWT_SECRET!);
      req.user = decoded;

      next();
   } catch (error) {
      clearCookie(res);

      res.status(401).json({
         success: false,
         message: "Acceso no autorizado",
      });
   }
};
