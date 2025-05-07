import { Router } from "express";
import {
  createQuestion,
  getByCategoryAndLevel,
} from "../controller/question-answer-css-controller";
const questionCssRoute = Router();

questionCssRoute.post("/create-question", createQuestion);
questionCssRoute.get("/:category/:level", getByCategoryAndLevel);

export default questionCssRoute;
