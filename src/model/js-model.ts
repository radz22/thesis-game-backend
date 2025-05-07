import mongoose, { Document, Schema, Model } from "mongoose";
import { jsQuestion } from "../types/question-type";
interface jsQuestionDocuments extends jsQuestion, Document {}

const jsQuestionSchema: Schema = new Schema(
  {
    level: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer1: {
      type: String,
      required: false,
      trim: true,
    },
    answer2: {
      type: String,
      required: false,
      trim: true,
    },
    answer3: {
      type: String,
      required: false,
      trim: true,
    },
    answer4: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export const jsQuestionModel: Model<jsQuestionDocuments> =
  mongoose.model<jsQuestionDocuments>("jsquestion", jsQuestionSchema);
