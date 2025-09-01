import { Request, Response } from "express";
import { BaseController } from "./BaseController.ts";
import { FieldService } from "../services/FieldService.ts";

const fieldService = new FieldService();

export class FieldController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const inventoryId = parseInt(req.params.inventoryId);
      return await fieldService.getAll(inventoryId, user.userId);
    });

  getById = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const inventoryId = parseInt(req.params.inventoryId);
      const fieldId = parseInt(req.params.fieldId);
      return await fieldService.getById(inventoryId, fieldId, user.userId);
    });

  create = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const user = (req as any).user;
        const inventoryId = parseInt(req.params.inventoryId);
        const { name, type } = req.body;
        return await fieldService.create(inventoryId, user.userId, name, type);
      },
      201
    );

  update = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const inventoryId = parseInt(req.params.inventoryId);
      const fieldId = parseInt(req.params.fieldId);
      const data = req.body;
      return await fieldService.update(inventoryId, fieldId, user.userId, data);
    });

  delete = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const inventoryId = parseInt(req.params.inventoryId);
      const fieldId = parseInt(req.params.fieldId);
      return await fieldService.delete(inventoryId, fieldId, user.userId);
    });
}
