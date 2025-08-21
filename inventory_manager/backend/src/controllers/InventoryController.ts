import { Request, Response } from "express";
import { InventoryService } from "../services/InventoryService.ts";
import { BaseController } from "./BaseController.ts";

const inventoryService = new InventoryService();

export class InventoryController extends BaseController {
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

  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      return await inventoryService.getAll(user.userId);
    });

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
