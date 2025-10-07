import { Request, Response } from "express";
import { queueService } from "../services/queue.service";
import { moduleService } from "../services/module.service";
import { AuthRequest } from "../types/auth";
import { personalService } from "../services/personal.service";

export const createTurn = async (req: Request, res: Response) => {
   try {
      const { nationalId } = req.body;

      if (!nationalId) {
         return res.status(400).json({
            success: false,
            message: "ID es requerido",
         });
      }

      const turn = await queueService.createTurn(nationalId);

      res.status(200).json({
         success: true,
         message: `Turno creado\n Ticket: ${turn.ticketCode}`,
         turn: turn,
      });
   } catch (error: any) {
      if (error.message === "Ya tienes un turno activo") {
         return res.status(409).json({
            success: false,
            message: "Ya tienes un turno activo",
         });
      } else if (error.message === "Usuario no encontrado") {
         return res.status(404).json({
            success: false,
            message: "Usuario no encontrado",
         });
      } else {
         res.status(500).json({
            success: false,
            message: "Error del servidor",
         });
      }
   }
};

export const cancelTurn = async (req: Request, res: Response) => {
   try {
      const { turnId } = req.params;
      const turn = await queueService.cancelTurn(turnId);

      return res.status(200).json({
         success: true,
         message: "Turno cancelado",
         turn,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const getWaitingTurns = async (_req: Request, res: Response) => {
   try {
      const turns = await queueService.getWaitingTurns();

      res.status(200).json({
         success: true,
         turns,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const getCurrentlyServed = async (_req: Request, res: Response) => {
   try {
      const turns = await queueService.getCurrentlyServed();

      res.status(200).json({
         success: true,
         turns,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const takeModule = async (req: AuthRequest, res: Response) => {
   try {
      const { moduleId } = req.body;
      const { userId } = req.user;

      const personal = await personalService.findById(userId);
      await queueService.takeModule(moduleId, personal.id);

      res.status(200).json({
         success: true,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const leaveModule = async (req: Request, res: Response) => {
   try {
      const { moduleId } = req.body;
      await queueService.leaveModule(moduleId);

      res.status(200).json({
         success: true,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const callNext = async (req: Request, res: Response) => {
   try {
      const { moduleId } = req.body;

      if (!moduleId) {
         return res.status(400).json({
            success: false,
            message: "ID del módulo es requerido",
         });
      }

      const result = await queueService.assignToModule(moduleId);

      if (!result) {
         return res.status(200).json({
            success: true,
            message: "No hay personas en espera",
            turn: null,
         });
      }

      res.status(200).json({
         success: true,
         turn: result,
      });
   } catch {
      res.status(400).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const completeTurn = async (req: Request, res: Response) => {
   try {
      const { agentId } = req.body;
      const { turnId } = req.params;

      if (!turnId) {
         return res.status(400).json({
            success: false,
            message: "ID del turno es requerido",
         });
      }

      await queueService.completeTurn(turnId, agentId);

      res.status(200).json({
         success: true,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const getQueueStats = async (_req: Request, res: Response) => {
   try {
      const stats = await queueService.getQueueStats();

      res.status(200).json({
         success: true,
         stats,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

// Module actions
export const getModules = async (_req: Request, res: Response) => {
   try {
      const modules = await moduleService.getAll();

      res.status(200).json({
         success: true,
         modules,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const createModule = async (req: Request, res: Response) => {
   try {
      const { name, description } = req.body;
      const exists = await moduleService.exists(name);

      if (exists) {
         return res.status(500).json({
            success: false,
            message: "El nombre del módulo ya existe",
         });
      }

      const module = await moduleService.create(name, description);

      res.status(200).json({
         success: true,
         message: `Módulo creado: ${module.name}`,
         newModule: module,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const editModule = async (req: Request, res: Response) => {
   try {
      const { name, description } = req.body;
      const { id } = req.params;

      const module = await moduleService.edit(id, { name, description });

      res.status(200).json({
         success: true,
         message: `Módulo actualizado: ${module.name}`,
         module: module,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};

export const deleteModule = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const module = await moduleService.delete(id);

      res.status(200).json({
         success: true,
         message: `Módulo eliminado: ${module.name}`,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error del servidor",
      });
   }
};
