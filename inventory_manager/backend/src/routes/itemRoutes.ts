import { Router } from "express";
import { InventoryRole } from "@prisma/client";
import { ItemController } from "../controllers/ItemController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { authorizeInventoryRole } from "../middleware/inventoryRoles.ts";

const router = Router({ mergeParams: true });
const controller = new ItemController();

router.post(
  "/",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.create
);

router.get("/", controller.getAll);
router.get("/:itemId", controller.getById);

router.put(
  "/:itemId",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.update
);

router.delete(
  "/:itemId",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.delete
);

export default router;
