import { Router } from "express";
import {
  createPoint,
  getLeaderBoard,
} from "../controller/leader-board-controller";
const leaderBoardRoute = Router();

leaderBoardRoute.post("/create-point", createPoint);
leaderBoardRoute.get("/", getLeaderBoard);

export default leaderBoardRoute;
