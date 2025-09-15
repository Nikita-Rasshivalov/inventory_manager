import { Router } from "express";
import { TemplateController } from "../../controllers/Odoo/TemplateController.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const router = Router();
const controller = new TemplateController();

router.post("/", authMiddleware, controller.createTemplate);
router.get("/", authMiddleware, controller.getTemplates);
router.get("/:id", authMiddleware, controller.getTemplateById);
router.delete("/:id", authMiddleware, controller.deleteTemplate);

export default router;
