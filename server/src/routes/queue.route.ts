import express from "express";
import {
   callNext,
   cancelTurn,
   completeTurn,
   createTurn,
   getCurrentlyServed,
   getQueueStats,
   getWaitingTurns,
} from "../controllers/queue.controller";

const router = express.Router();

// Reception routes
router.post("/create", createTurn);
router.post("/cancel/:turnId", cancelTurn);
router.get("/waiting", getWaitingTurns);
router.get("/stats", getQueueStats);

// Agent routes
router.post("/call-next", callNext);
router.post("/complete/:turnId", completeTurn);
router.get("/currently-served", getCurrentlyServed);

export default router;
