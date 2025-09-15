import { Router } from "express";
import { AnswerController } from "../../controllers/Odoo/AnswerController.ts";

const router = Router();
const controller = new AnswerController();

router.post("/", controller.addAnswers);
router.get("/:questionId", controller.getAnswers);
router.delete("/:id", controller.deleteAnswer);

export default router;
