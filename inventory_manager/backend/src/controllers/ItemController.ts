import { Request, Response } from "express";
import { ItemService } from "../services/ItemService.ts";
import { BaseController } from "./BaseController.ts";

const itemService = new ItemService();

export class ItemController extends BaseController {
  create = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const inventoryId = parseInt(req.params.inventoryId);
        const userId = (req as any).user.userId;
        const data = req.body;
        const customIdFormat = data.customIdFormat;
        return await itemService.create(
          inventoryId,
          userId,
          data,
          customIdFormat
        );
      },
      201
    );

  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const inventoryId = parseInt(req.params.inventoryId);
      return await itemService.getAll(inventoryId);
    });

  getById = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const inventoryId = parseInt(req.params.inventoryId);
      const itemId = parseInt(req.params.itemId);
      return await itemService.getById(inventoryId, itemId);
    });

  update = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const inventoryId = parseInt(req.params.inventoryId);
      const itemId = parseInt(req.params.itemId);
      const data = req.body;
      return await itemService.update(inventoryId, itemId, data);
    });

  delete = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const inventoryId = parseInt(req.params.inventoryId);
      const itemId = parseInt(req.params.itemId);
      return await itemService.delete(inventoryId, itemId);
    });
}
