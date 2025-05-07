import { Router } from "express";
import {
  createQuestion,
  getByCategoryAndLevel,
} from "../controller/question-answer-html-controller";
const questionHtmlRoute = Router();

questionHtmlRoute.post("/create-question", createQuestion);
questionHtmlRoute.get("/:category/:level", getByCategoryAndLevel);

export default questionHtmlRoute;
