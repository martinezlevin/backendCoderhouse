import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";

const router = Router();
const pm = new productManagerDB;
const cm = new CartManagerDB;

router.get("/products", async (req, res) => {
  let products = await pm.getProducts(req);
  let carts = await cm.getCarts();
  res.render("products", { products, carts, styles: "products.css" });
});

router.get("/carts/:cid", async (req, res) => {
  let cart = await cm.getCartView(req, res);
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await pm.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;