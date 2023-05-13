import { Schema, model } from "mongoose";

const ticketsCollection = "tickets";

const ticketItemSchema = new Schema({
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

const ticketsSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    amount: Number,
    purchaser: String,
    products: [ticketItemSchema],
  },
  {
    timestamps: {
      createdAt: "purchase_datetime",
    },
  }
);

export const ticketsModel = model(ticketsCollection, ticketsSchema);