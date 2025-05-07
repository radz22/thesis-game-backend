import mongoose, { Document, Schema, Model } from "mongoose";
import { level } from "../types/level-type";
interface LevelDocument extends level, Document {}

const levelSchema: Schema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
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
export const levelModel: Model<LevelDocument> = mongoose.model<LevelDocument>(
  "level",
  levelSchema
);
