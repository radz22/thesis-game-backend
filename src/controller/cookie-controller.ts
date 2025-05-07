import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";
export const getCookies = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.auth_accessToken;
    if (!token) {
      throw new CustomError("No token provided", 401);
    }
    res.status(200).json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
