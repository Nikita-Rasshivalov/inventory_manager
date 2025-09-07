import { Router } from "express";
import { TagController } from "../controllers/TagController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = Router();
const controller = new TagController();

router.get("/", controller.getAll);
router.get("/search", controller.search);
router.post("/", authMiddleware, controller.create);

export default router;
