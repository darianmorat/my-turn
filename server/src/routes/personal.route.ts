import express from "express";
import {
   createUser,
   getUsers,
   deleteUser,
   editUser,
} from "../controllers/personal.controller";
// import { privateRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/get-all", /* privateRoute, */ getUsers);
router.post("/create", /* privateRoute, */ createUser);
router.post("/edit/:id", /* privateRoute, */ editUser);
router.delete("/delete/:id", /* privateRoute, */ deleteUser);

export default router;
