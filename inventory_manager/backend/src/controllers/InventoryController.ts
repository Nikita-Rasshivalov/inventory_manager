import { Request, Response } from "express";
import { InventoryService } from "../services/InventoryService.ts";
import { BaseController } from "./BaseController.ts";
import { InventoryQueryParams } from "../models/queries.ts";
import { InventoryFilter } from "../models/types.ts";

const inventoryService = new InventoryService();
export class InventoryController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      if (!user) throw new Error("User not authenticated");
      const filterParam = req.query.inventoryFilter as string | undefined;
      let inventoryFilter: InventoryFilter | undefined;
      if (
        filterParam &&
        Object.values(InventoryFilter).includes(filterParam as InventoryFilter)
      ) {
        inventoryFilter = filterParam as InventoryFilter;
      }

      const query: InventoryQueryParams = {
        page: parseInt((req.query.page as string) ?? "1", 10),
        limit: parseInt((req.query.limit as string) ?? "10", 10),
        search: (req.query.search as string) ?? "",
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
        inventoryFilter,
      };

      return await inventoryService.getAll(user.userId, query);
    });

  create = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const { title, isPublic } = req.body;
        const user = (req as any).user;
        return await inventoryService.create(title, user.userId, isPublic);
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
      const inventoryId = parseInt(req.params.inventoryId);

      const { version, isPublic, ...data } = req.body;

      return await inventoryService.update(
        inventoryId,
        { ...data, isPublic },
        user.userId,
        version
      );
    });

  delete = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const ids: number[] = req.body.ids;
      return await inventoryService.delete(ids, user.userId);
    });

  updateMembers = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const currentUser = (req as any).user;
      const inventoryId = parseInt(req.params.inventoryId);
      const updates = req.body.updates;
      return await inventoryService.updateMembers(
        inventoryId,
        currentUser.userId,
        updates
      );
    });

  getComments = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const inventoryId = parseInt(req.params.inventoryId);
      return await inventoryService.getComments(inventoryId);
    });

  addComment = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const user = (req as any).user;
        const inventoryId = parseInt(req.params.inventoryId);
        const { content } = req.body;
        if (!content) throw new Error("Comment content is required");
        return await inventoryService.addComment(
          inventoryId,
          user.userId,
          content
        );
      },
      201
    );

  deleteComment = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      const commentId = parseInt(req.params.commentId);
      return await inventoryService.deleteComment(commentId, user.userId);
    });
}
