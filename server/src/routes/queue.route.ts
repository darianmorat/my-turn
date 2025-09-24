import express from "express";
import {
   callNext,
   completeTurn,
   createModule,
   createTurn,
   getCurrentlyServed,
   getModules,
   getQueueStats,
   getWaitingTurns,
} from "../controllers/queue.controller";

const router = express.Router();

// Reception routes
router.post("/create", createTurn);
router.get("/waiting", getWaitingTurns);
router.get("/stats", getQueueStats);

// Agent routes
router.post("/call-next", callNext);
router.post("/complete/:turnId", completeTurn);
router.get("/currently-served", getCurrentlyServed);

// System routes
router.get("/modules", getModules);
router.post("/modules/create", createModule);

export default router;
