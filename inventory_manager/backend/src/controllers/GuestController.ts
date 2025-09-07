import { Request, Response } from "express";
import { guestService } from "../services/GuestService.ts";
import { BaseController } from "./BaseController.ts";

class GuestController extends BaseController {
  async getLatest(req: Request, res: Response) {
    await this.handle(res, async () => {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      return guestService.getLatestInventories(limit);
    });
  }

  async getTop(req: Request, res: Response) {
    await this.handle(res, async () => {
      return guestService.getTopInventories(5);
    });
  }

  async getByTag(req: Request, res: Response) {
    await this.handle(res, async () => {
      const tag = req.params.tag;
      if (!tag) throw new Error("Tag is required");
      return guestService.getInventoriesByTag(tag);
    });
  }
}

export const guestController = new GuestController();
