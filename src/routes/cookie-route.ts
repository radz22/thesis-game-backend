import { Router } from "express";
import { getCookies } from "../controller/cookie-controller";
const cookieRoute = Router();

cookieRoute.get("/", getCookies);

export default cookieRoute;
