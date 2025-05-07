import mongoose, { Document, Schema, Model } from "mongoose";
import { sessions } from "../types/session-type";
interface SessionDocument extends sessions, Document {}

const sessionSchema: Schema = new Schema(
  {
    refresh_token: {
      type: String,
      required: true,
      trim: true,
    },
    account_id: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export const sessionModel: Model<SessionDocument> =
  mongoose.model<SessionDocument>("session", sessionSchema);
