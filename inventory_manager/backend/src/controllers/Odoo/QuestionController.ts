import { Request, Response } from "express";
import { QuestionService } from "../../services/Odoo/QuestionService.ts";
import { BaseController } from "../BaseController.ts";

export class QuestionController extends BaseController {
  private service = new QuestionService();

  addQuestions = async (req: Request, res: Response) => {
    await this.handle(
      res,
      async () => {
        const { templateId, questions } = req.body;
        if (!Array.isArray(questions)) {
          throw new Error("questions must be an array");
        }
        return this.service.addQuestions(templateId, questions);
      },
      201
    );
  };

  getQuestions = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      return this.service.getQuestions(Number(req.params.templateId));
    });
  };

  deleteQuestion = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      return this.service.deleteQuestion(Number(req.params.id));
    });
  };
}
