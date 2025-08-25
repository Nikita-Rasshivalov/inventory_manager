import { Router } from "express";
import { InventoryRole } from "@prisma/client";
import { ItemController } from "../controllers/ItemController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { authorizeInventoryRole } from "../middleware/inventoryRoles.ts";

const router = Router();
const controller = new ItemController();

router.post(
  "/",
  authMiddleware,
  authorizeInventoryRole(InventoryRole.OWNER, InventoryRole.WRITER),
  controller.create
);

router.get(
  "/",
  authMiddleware,
  authorizeInventoryRole(
    InventoryRole.OWNER,
    InventoryRole.WRITER,
    InventoryRole.READER
  ),
  controller.getAll
);

router.get(
  "/:itemId",
  authMiddleware,
  authorizeInventoryRole(
    InventoryRole.OWNER,
    InventoryRole.WRITER,
    InventoryRole.READER
  ),
  controller.getById
);

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
