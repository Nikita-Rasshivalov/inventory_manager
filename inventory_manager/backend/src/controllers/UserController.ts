import { Request, Response } from "express";
import { UserService } from "../services/UserService.ts";
import { BaseController } from "./BaseController.ts";

const userService = new UserService();

export class UserController extends BaseController {
  getAll = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const search = req.query.q as string;
      return await userService.getAll(search);
    });
}
