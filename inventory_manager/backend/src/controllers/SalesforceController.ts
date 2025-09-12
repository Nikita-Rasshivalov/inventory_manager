import { Request, Response } from "express";
import { SalesforceService } from "../services/SalesforceService.ts";
import { BaseController } from "./BaseController.ts";

const sfService = new SalesforceService();

export class SalesforceController extends BaseController {
  createAccount = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { userId, company, position, phone } = req.body;
      return await sfService.createAccountAndContact(userId, {
        company,
        position,
        phone,
      });
    });
  };

  getAccount = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { userId } = req.params;
      return await sfService.getAccountAndContact(Number(userId));
    });
  };

  updateAccount = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { userId } = req.body;
      return await sfService.updateAccountAndContact(Number(userId), req.body);
    });
  };
}
