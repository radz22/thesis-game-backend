import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/custom-error";
import "dotenv/config";
import { leaderBoardModel } from "../model/leader-board-model";
import { levelModel } from "../model/level-model";
export const createPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.cookies?.auth_accessToken;

  if (!accessToken) {
    return next(new CustomError("Unauthorized", 400));
  }

  try {
    const { category, level, points } = req.body;
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    ) as { id: string; email: string; username: string };

    const checkUser = await leaderBoardModel.findOne({
      user_id: decodedAccessToken.id,
    });

    if (!checkUser) {
      const createUserLevel = await levelModel.create({
        user_id: decodedAccessToken.id,
        level,
        points,
        category,
      });

      const createAccountInLeaderBoard = await leaderBoardModel.create({
        user_id: decodedAccessToken.id,
        email: decodedAccessToken.email,
        username: decodedAccessToken.username,
        points,
      });

      if (!createAccountInLeaderBoard || !createUserLevel) {
        throw new CustomError("Error creating user records", 400);
      }

      res.status(200).json({
        message: "Created Points",
        leaderboard: createAccountInLeaderBoard,
        level: createUserLevel,
      });
      return;
    }

    let findUserLevel = await levelModel.findOne({
      user_id: decodedAccessToken.id,
      level,
      category,
    });

    if (!findUserLevel) {
      const incrementPointsFromUser = await leaderBoardModel.findOneAndUpdate(
        { user_id: decodedAccessToken.id },
        { $inc: { points } },
        { new: true }
      );

      const createUserLevel = await levelModel.create({
        user_id: decodedAccessToken.id,
        level,
        points,
        category,
      });

      res.status(200).json({
        message: "New level added and points incremented",
        level: createUserLevel,
        leaderboard: incrementPointsFromUser,
      });
      return;
    }

    if (findUserLevel.points == 3) {
      res.status(200).json({ message: "No need to add points" });
    }

    if (findUserLevel.points == points) {
      res.status(200).json({ message: "No update needed" });
    }

    const updateCheckPoint = await levelModel.findOneAndUpdate(
      { user_id: decodedAccessToken.id, level, category },
      { points },
      { new: true }
    );

    const incrementPointsFromUser = await leaderBoardModel.findOneAndUpdate(
      { user_id: decodedAccessToken.id },
      { $inc: { points: points - findUserLevel.points } }, // Ensure points are not added twice
      { new: true }
    );

    res.status(200).json({
      message: "Points successfully updated",
      leaderboard: incrementPointsFromUser,
      level: updateCheckPoint,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leaderBoard = await leaderBoardModel.find().sort({ points: -1 });
    res.status(200).json({ data: leaderBoard });
  } catch (error) {
    next(error);
  }
};
