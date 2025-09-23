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

export const create = async (req: Request, res: Response) => {
   try {
      const { nationalId, name } = req.body;
      const user = await userService.create(nationalId, name);

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
