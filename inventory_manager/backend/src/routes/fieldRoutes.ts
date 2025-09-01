import { Router } from "express";
import { InventoryRole } from "@prisma/client";
import { FieldController } from "../controllers/FieldController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { authorizeInventoryRole } from "../middleware/inventoryRoles.ts";

const router = Router();
const controller = new FieldController();

router.get(
  "/:inventoryId/fields",
  authMiddleware,
  authorizeInventoryRole(
    InventoryRole.OWNER,
    InventoryRole.WRITER,
    InventoryRole.READER
  ),
  controller.getAll
);

router.get(
  "/:inventoryId/fields/:fieldId",
  authMiddleware,
  authorizeInventoryRole(
    InventoryRole.OWNER,
    InventoryRole.WRITER,
    InventoryRole.READER
  ),
  controller.getById
);

router.post(
  "/:inventoryId/fields",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.create
);

router.put(
  "/:inventoryId/fields/:fieldId",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.update
);

router.delete(
  "/:inventoryId/fields/:fieldId",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.delete
);

export default router;
