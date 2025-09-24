import { Request, Response } from "express";
import { queueService } from "../services/queue.service";

export const createTurn = async (req: Request, res: Response) => {
   try {
      const { nationalId } = req.body;

      if (!nationalId) {
         return res.status(400).json({
            success: false,
            message: "National ID is required",
         });
      }

      const turn = await queueService.createTurn(nationalId);

      res.status(200).json({
         success: true,
         message: `Turn created successfully. Ticket: ${turn.ticketCode}`,
         turn,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: error.message || "Failed to create turn",
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
   } catch (error: any) {
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
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Failed to get currently served turns",
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
   } catch (error: any) {
      res.status(400).json({
         success: false,
         message: error.message || "Failed to call next person",
      });
   }
};

export const completeTurn = async (req: Request, res: Response) => {
   try {
      const { turnId } = req.params;

      if (!turnId) {
         return res.status(400).json({
            success: false,
            message: "Turn ID is required",
         });
      }

      await queueService.completeTurn(turnId);

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
      const modules = await queueService.getAllModules();

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
      const module = await queueService.createModule(name, description);

      res.status(200).json({
         success: true,
         module,
      });
   } catch {
      res.status(500).json({
         success: false,
         message: "Failed to get modules",
      });
   }
};
