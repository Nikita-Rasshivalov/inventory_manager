import { Router } from "express";
import { InventoryRole } from "@prisma/client";
import { InventoryController } from "../controllers/InventoryController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { authorizeInventoryRole } from "../middleware/inventoryRoles.ts";

const router = Router();
const controller = new InventoryController();

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get(
  "/:inventoryId",
  authMiddleware,
  authorizeInventoryRole(
    InventoryRole.OWNER,
    InventoryRole.WRITER,
    InventoryRole.READER
  ),
  controller.getById
);

router.put(
  "/:inventoryId",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.update
);
router.delete(
  "/:inventoryId",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER),
  controller.delete
);

export default router;
