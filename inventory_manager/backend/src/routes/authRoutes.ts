import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", authMiddleware, controller.me);

export default router;
