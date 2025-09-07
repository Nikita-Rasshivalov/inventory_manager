import { Request, Response } from "express";
import { BaseController } from "./BaseController.ts";
import { TagService } from "../services/TagService.ts";

const tagService = new TagService();

export class TagController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      return await tagService.getAll();
    });

  getById = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const id = parseInt(req.params.id);
      return await tagService.getById(id);
    });

  search = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const q = (req.query.q as string) ?? "";
      return await tagService.searchByName(q);
    });

  create = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const { name } = req.body;
        if (!name) throw new Error("Tag name is required");
        return await tagService.create(name);
      },
      201
    );
}
