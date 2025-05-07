import mongoose, { Document, Schema, Model } from "mongoose";
import { leaderboard } from "../types/leader-board-type";
interface LeaderBoardDocument extends leaderboard, Document {}

const leaderBoardSchema: Schema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export const leaderBoardModel: Model<LeaderBoardDocument> =
  mongoose.model<LeaderBoardDocument>("leadeboard", leaderBoardSchema);
