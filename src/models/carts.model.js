import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cartsSchema = new Schema({
  alias: String,
  products: [cartItemSchema],
});

export const cartsModel = model(cartsCollection, cartsSchema);