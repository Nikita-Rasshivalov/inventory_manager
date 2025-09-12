import { Router } from "express";
import { SalesforceController } from "../controllers/SalesforceController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = Router();
const controller = new SalesforceController();

router.post("/create-account", authMiddleware, controller.createAccount);
router.get("/account/:userId", authMiddleware, controller.getAccount);
router.put("/account", authMiddleware, controller.updateAccount);

export default router;
