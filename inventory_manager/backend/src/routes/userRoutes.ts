import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { UserController } from "../controllers/UserController.ts";

const router = Router();
const controller = new UserController();

router.get("/", authMiddleware, controller.getAll);

export default router;
