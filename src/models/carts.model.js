import { Schema, model } from "mongoose";

const ordersCollection = "orders";

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const ordersSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    status: String,
    amount: Number,
    purchaser: String,
    products: [orderItemSchema],
  },
  {
    timestamps: true,
  }
);

export const ordersModel = model(ordersCollection, ordersSchema);