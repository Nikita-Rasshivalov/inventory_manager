import { Request, Response } from "express";
import { BaseController } from "../BaseController.ts";
import { AnswerService } from "../../services/Odoo/AnswerService.ts";

export class AnswerController extends BaseController {
  private service = new AnswerService();

  addAnswers = async (req: Request, res: Response) => {
    await this.handle(
      res,
      async () => {
        const { questionId, values } = req.body;
        if (!Array.isArray(values)) {
          throw new Error("values must be an array");
        }
        return this.service.addAnswers(questionId, values);
      },
      201
    );
  };

  getAnswers = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      return this.service.getAnswers(Number(req.params.questionId));
    });
  };

  deleteAnswer = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      return this.service.deleteAnswer(Number(req.params.id));
    });
  };
}
