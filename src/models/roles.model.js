import { Schema, model } from "mongoose";

const rolesCollection = "roles";
const rolesSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export const rolesModel = model(rolesCollection, rolesSchema);