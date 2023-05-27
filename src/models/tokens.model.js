import { Schema, model } from "mongoose";

const tokensCollection = "tokens";

const tokensSchema = new Schema(
  {
    email: String,
    token: String,
    type: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    }
  }
);

export const tokensModel = model(tokensCollection, tokensSchema);