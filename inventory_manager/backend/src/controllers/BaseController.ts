import { Response } from "express";
import { sendErrorResponse } from "../utils/errorHandler.ts";

export abstract class BaseController {
  protected async handle(
    res: Response,
    fn: () => Promise<any>,
    statusCode = 200
  ) {
    try {
      const result = await fn();
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error caught in BaseController:", error);
      sendErrorResponse(res, error, 500);
    }
  }
}
