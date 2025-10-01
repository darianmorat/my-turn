import { Request, Response } from "express";
import { userService } from "../services/user.service";

export const getAll = async (_req: Request, res: Response) => {
   try {
      const users = await userService.getAll();

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
      const { name, nationalId } = req.body;
      const user = await userService.createUser(name, nationalId);

      res.status(200).json({
         success: true,
         message: "Usuario creado",
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
      const { name, nationalId } = req.body;
      const { id } = req.params;
      const user = await userService.edit(id, { name, nationalId });

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
      const user = await userService.delete(id);

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
