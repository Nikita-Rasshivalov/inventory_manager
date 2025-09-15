import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.ts";
import { OdooController } from "../../controllers/Odoo/OdooController.ts";

const router = Router();
const controller = new OdooController();

router.post("/generate-token", authMiddleware, controller.generateToken);
router.get("/templates/aggregated", controller.getAggregatedTemplates);

export default router;
