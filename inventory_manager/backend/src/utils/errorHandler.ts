import { Response } from "express";

export function sendErrorResponse(
  res: Response,
  error: unknown,
  statusCode = 400
) {
  if (error instanceof Error) {
    res.status(statusCode).json({ error: error.message });
  } else {
    res.status(statusCode).json({ error: "Unknown error" });
  }
}
