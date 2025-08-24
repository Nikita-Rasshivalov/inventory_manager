import { Request, Response } from "express";
import { InventoryService } from "../services/InventoryService.ts";
import { BaseController } from "./BaseController.ts";
import { InventoryQueryParams } from "../models/queries.ts";
import { InventoryRole } from "@prisma/client";

const inventoryService = new InventoryService();
export class InventoryController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const query: InventoryQueryParams = {
        page: parseInt((req.query.page as string) ?? "1", 10),
        limit: parseInt((req.query.limit as string) ?? "10", 10),
        search: (req.query.search as string) ?? "",
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
        role: req.query.role as InventoryRole,
      };

      return await inventoryService.getAll(user.userId, query);
    });

  create = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const { title } = req.body;
        const user = (req as any).user;
        return await inventoryService.create(title, user.userId);
      },
      201
    );

  getById = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const id = parseInt(req.params.inventoryId);
      return await inventoryService.getById(id, user.userId);
    });

  update = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const id = parseInt(req.params.inventoryId);
      const data = req.body;
      return await inventoryService.update(id, data, user.userId);
    });

  delete = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const ids: number[] = req.body.ids;
      return await inventoryService.delete(ids, user.userId);
    });
}
