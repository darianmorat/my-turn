import express from "express";
import { createUser, getAll, editUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/get-all", getAll);
router.post("/create", createUser);
router.post("/edit/:id", /* privateRoute, */ editUser);
router.delete("/delete/:id", /* privateRoute, */ deleteUser);

export default router;
