import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";
export const errorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};
