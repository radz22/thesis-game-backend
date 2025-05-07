import { Request } from "express";

interface RequestWithSession extends Request {
  session?: {
    account_id: string;
    email: string;
    username: string;
  };
}

export default RequestWithSession;
