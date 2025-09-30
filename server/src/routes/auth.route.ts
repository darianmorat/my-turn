import express from "express";
import { privateRoute } from "../middleware/auth.middleware";
import { authenticate, logout, verify } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", authenticate);
router.post("/logout", logout);
router.get("/verify", privateRoute, verify);

export default router;
