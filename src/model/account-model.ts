import mongoose, { Document, Schema, Model } from "mongoose";
import { accounts } from "../types/account-type";

interface AccountDocument extends accounts, Document {}

const accountSchema: Schema = new Schema(
  {
    username: {
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
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export const accountModel: Model<AccountDocument> =
  mongoose.model<AccountDocument>("account", accountSchema);
