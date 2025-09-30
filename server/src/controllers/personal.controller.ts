import { Request, Response } from "express";
import { personalService } from "../services/personal.service";

export const getUsers = async (_req: Request, res: Response) => {
   try {
      const users = await personalService.findAll();

      res.status(200).json({
         success: true,
         users: users,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "server error",
      });
   }
};

export const createUser = async (req: Request, res: Response) => {
   try {
      const { name, email, password, role } = req.body;
      const existingUser = await personalService.exists(email);

      if (existingUser) {
         res.status(409).json({
            success: false,
            message: "Este correo ya está en uso",
         });

         return;
      }

      const user = await personalService.create(name, email, password, role);

      res.status(200).json({
         success: true,
         message: `Usuario "${user.name}" creado`,
         newUser: user,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "server error",
      });
   }
};

export const editUser = async (req: Request, res: Response) => {
   try {
      const { name, email, password, role } = req.body;
      const { id } = req.params;
      const user = await personalService.edit(id, { name, email, password, role });

      res.status(200).json({
         success: true,
         message: "Información actualizada",
         user: user,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "server error",
      });
   }
};

export const deleteUser = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const user = await personalService.delete(id);

      res.status(200).json({
         success: true,
         message: `Usuario "${user.name}" eliminado`,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "server error",
      });
   }
};
