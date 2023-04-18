import mongoose, { Schema, model } from "mongoose";

const usersCollection = "users";

const usersSchema = new Schema({
  name: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  age: Number,
  role: String,
  github: Boolean,
  githubProfile: Object,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
});

export const usersModel = model(usersCollection, usersSchema);