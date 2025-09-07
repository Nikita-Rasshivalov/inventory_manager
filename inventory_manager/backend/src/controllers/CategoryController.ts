import { Request, Response } from "express";
import { BaseController } from "./BaseController.ts";
import { CategoryService } from "../services/CategoryService.ts";

const categoryService = new CategoryService();

export class CategoryController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      return await categoryService.getAll();
    });

  getById = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const id = parseInt(req.params.id);
      return await categoryService.getById(id);
    });
}
