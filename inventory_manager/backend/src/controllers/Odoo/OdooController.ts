import { Request, Response } from "express";
import { BaseController } from "../BaseController.ts";
import { OdooService } from "../../services/Odoo/OdooService.ts";

export class OdooController extends BaseController {
  private service = new OdooService();

  generateToken = async (req: Request, res: Response) => {
    await this.handle(
      res,
      async () => {
        const userId = (req as any).user.userId;
        return this.service.generateToken(userId);
      },
      201
    );
  };

  getAggregatedTemplates = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const token = req.headers["x-api-token"] as string;
      if (!token) throw new Error("API token required");
      return this.service.getAggregatedTemplates(token);
    });
  };
}
