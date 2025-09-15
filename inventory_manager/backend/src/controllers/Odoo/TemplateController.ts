import { Request, Response } from "express";
import { TemplateService } from "../../services/Odoo/TemplateService.ts";
import { BaseController } from "../BaseController.ts";

export class TemplateController extends BaseController {
  private service = new TemplateService();

  createTemplate = async (req: Request, res: Response) => {
    await this.handle(
      res,
      async () => {
        const { name, userId } = req.body;
        return this.service.createTemplate(userId, name);
      },
      201
    );
  };

  getTemplates = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { userId } = req.body;
      return this.service.getTemplates(userId);
    });
  };

  getTemplateById = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      return this.service.getTemplateById(Number(req.params.id));
    });
  };

  deleteTemplate = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { userId } = req.body;
      return this.service.deleteTemplate(Number(req.params.id), userId);
    });
  };
}
