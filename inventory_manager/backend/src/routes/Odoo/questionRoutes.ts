import { Router } from "express";
import { QuestionController } from "../../controllers/Odoo/QuestionController.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const router = Router();
const controller = new QuestionController();

router.post("/", authMiddleware, controller.addQuestions);
router.get("/:templateId", authMiddleware, controller.getQuestions);
router.delete("/:id", authMiddleware, controller.deleteQuestion);

export default router;
