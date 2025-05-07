import { Router } from "express";
import {
  createQuestion,
  getByCategoryAndLevel,
} from "../controller/question-answer-js-controller";
const questionJsRoute = Router();

questionJsRoute.post("/create-question", createQuestion);
questionJsRoute.get("/:category/:level", getByCategoryAndLevel);

export default questionJsRoute;
