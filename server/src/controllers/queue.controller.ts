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
            message: "National ID es requerido",
         });
      }

      const turn = await queueService.createTurn(nationalId);

      res.status(200).json({
         success: true,
         message: `Turno creado. Ticket: ${turn.ticketCode}`,
         turn: turn,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Failed to create turn",
      });
   }
};

export const cancelTurn = async (req: Request, res: Response) => {
   try {
      const { turnId } = req.params;
      const turn = await queueService.cancelTurn(turnId);

      return res.status(200).json({
         success: true,
         message: "Turno cancelado exitosamente",
         turn,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Failed to create turn",
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
         message: "Failed to get waiting turns",
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
         message: "Failed to get currently served turns",
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
         message: "Módulo tomado",
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error tomando el módulo",
      });
   }
};

export const leaveModule = async (req: Request, res: Response) => {
   try {
      const { moduleId } = req.body;
      await queueService.leaveModule(moduleId);

      res.status(200).json({
         success: true,
         message: "Módulo abandonnado",
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Error abandonando el módulo",
      });
   }
};

export const callNext = async (req: Request, res: Response) => {
   try {
      const { moduleId } = req.body;

      if (!moduleId) {
         return res.status(400).json({
            success: false,
            message: "Module ID is required",
         });
      }

      const result = await queueService.assignToModule(moduleId);

      if (!result) {
         return res.status(200).json({
            success: true,
            message: "No one waiting in queue",
            turn: null,
         });
      }

      res.status(200).json({
         success: true,
         message: `${result.ticketCode} called to module`,
         turn: result,
      });
   } catch {
      res.status(400).json({
         success: false,
         message: "Failed to call next person",
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
            message: "Turn ID is required",
         });
      }

      await queueService.completeTurn(turnId, agentId);

      res.status(200).json({
         success: true,
         message: "Service completed successfully",
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Failed to complete service",
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
         message: "Failed to get queue statistics",
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
         message: "Failed to get modules",
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
            message: "Nombre de modulo ya existe",
         });
      }

      const module = await moduleService.create(name, description);

      res.status(200).json({
         success: true,
         message: "Módulo creado",
         newModule: module,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Failed to get modules",
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
         message: "Información actualizada",
         module: module,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "server error",
      });
   }
};

export const deleteModule = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const module = await moduleService.delete(id);

      res.status(200).json({
         success: true,
         message: `${module.name} eliminado`,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "server error",
      });
   }
};
