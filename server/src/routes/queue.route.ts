import express from "express";
import {
   callNext,
   completeTurn,
   createTurn,
   getCurrentlyServed,
   getModules,
   getQueueStats,
   getWaitingTurns,
   initializeSystem,
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
router.post("/initialize", initializeSystem);

export default router;
