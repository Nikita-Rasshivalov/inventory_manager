import { Router } from "express";
import { InventoryRole } from "@prisma/client";
import { InventoryController } from "../controllers/InventoryController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { authorizeInventoryRole } from "../middleware/inventoryRoles.ts";
import { authorizeInventoryBulkRole } from "../middleware/authorizeInventoryBulkRole.ts";

const router = Router();
const controller = new InventoryController();

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);

router.delete(
  "/",
  authMiddleware,
  authorizeInventoryBulkRole,
  controller.delete
);

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

router.patch(
  "/:inventoryId/members",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER),
  controller.updateMembers
);

export default router;
