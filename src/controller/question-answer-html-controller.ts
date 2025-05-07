import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";
import { htmlQuestionModel } from "../model/html-model";
export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, level, question, answer1, answer2, answer3, answer4 } =
      req.body;

    const createQuestion = await htmlQuestionModel.create({
      category,
      level,
      question,
      answer1,
      answer2,
      answer3,
      answer4,
    });
    res.status(200).json({
      message: "Question created successfully",
      data: createQuestion,
    });
  } catch (error) {
    next(error);
  }
};
export const getByCategoryAndLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, level } = req.params;
    const question = await htmlQuestionModel.findOne({
      category,
      level,
    });

    if (!question) {
      throw new CustomError("Question not found", 404);
    }

    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};
