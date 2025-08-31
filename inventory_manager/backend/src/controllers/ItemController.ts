import { Request, Response } from "express";
import { ItemService } from "../services/ItemService.ts";

const itemService = new ItemService();

export class ItemController {
  create = async (req: Request, res: Response) => {
    const inventoryId = parseInt(req.params.inventoryId);
    const userId = (req as any).user.userId;
    const data = req.body;

    const item = await itemService.create(inventoryId, userId, data);
    res.status(201).json(item);
  };

  getAll = async (req: Request, res: Response) => {
    const inventoryId = parseInt(req.params.inventoryId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";

    const result = await itemService.getAll(
      inventoryId,
      page,
      limit,
      sortBy,
      sortOrder
    );
    res.json(result);
  };

  getById = async (req: Request, res: Response) => {
    const inventoryId = parseInt(req.params.inventoryId);
    const itemId = parseInt(req.params.itemId);
    const item = await itemService.getById(inventoryId, itemId);
    res.json(item);
  };

  update = async (req: Request, res: Response) => {
    const inventoryId = parseInt(req.params.inventoryId);
    const itemId = parseInt(req.params.itemId);
    const data = req.body;

    const item = await itemService.update(inventoryId, itemId, data);
    res.json(item);
  };

  delete = async (req: Request, res: Response) => {
    const inventoryId = parseInt(req.params.inventoryId);
    const itemId = parseInt(req.params.itemId);
    const item = await itemService.delete(inventoryId, itemId);
    res.json(item);
  };
}
