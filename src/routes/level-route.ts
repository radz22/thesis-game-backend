import { Router } from "express";
import {
  getFinishLevel,
  getLevel,
  levelValidation,
} from "../controller/level-controller";
const levelRoute = Router();

levelRoute.get("/:category", getFinishLevel);
levelRoute.post("/", getLevel);
levelRoute.post("/validate", levelValidation);
export default levelRoute;
