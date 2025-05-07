import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sessionModel } from "../model/session-model";
import "dotenv/config";
import { CustomError } from "../utils/custom-error";
import { createSessionAndDeleteToken } from "../services/create-authentication";
import RequestWithSession from "../types/request-with-session";
export const authenticationMiddleware = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.auth_accessToken;
  const refreshToken = req.cookies?.auth_refreshToken;

  if (!refreshToken || !accessToken) {
    return next(new CustomError("Unauthorized", 401));
  }

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    ) as { id: string; email: string; username: string };

    req.session = {
      account_id: decodedAccessToken.id,
      email: decodedAccessToken.email,
      username: decodedAccessToken.username,
    };

    return next();
  } catch {
    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: string; email: string; username: string };

      const currentSession = await sessionModel.findOne({
        account_id: decodedRefreshToken.id,
      });

      if (!currentSession) {
        return next(new CustomError("Session not found", 401));
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(
        {
          id: decodedRefreshToken.id,
          username: decodedRefreshToken.username,
          email: decodedRefreshToken.email,
          iss: "refresh",
          aud: "thesisgame.app",
        },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: "5m" }
      );

      const newRefreshToken = jwt.sign(
        {
          id: decodedRefreshToken.id,
          username: decodedRefreshToken.username,
          email: decodedRefreshToken.email,
          iss: "refresh",
          aud: "thesisgame.app",
        },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "1d" }
      );

      const { success_response } = await createSessionAndDeleteToken(
        decodedRefreshToken.id,
        newRefreshToken
      );

      if (!success_response) {
        return next(new CustomError("Failed to create session", 500));
      }

      res.cookie("auth_accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 5 * 60 * 1000,
      });

      res.cookie("auth_refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      // Attach session data
      req.session = {
        account_id: decodedRefreshToken.id,
        email: decodedRefreshToken.email,
        username: decodedRefreshToken.username,
      };

      return next();
    } catch {
      return next(new CustomError("Unauthorized", 401));
    }
  }
};
