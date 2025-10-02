import express from "express";
import {
   createModule,
   deleteModule,
   editModule,
   getModules,
} from "../controllers/queue.controller";

const router = express.Router();

router.get("/get-all", getModules);
router.post("/create", createModule);
router.post("/edit/:id", editModule);
router.post("/delete/:id", deleteModule);

export default router;
