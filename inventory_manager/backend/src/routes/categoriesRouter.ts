import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = Router();
const controller = new CategoryController();

router.get("/", controller.getAll);

export default router;
