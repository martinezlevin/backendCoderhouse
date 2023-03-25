import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";

const router = Router();
const productManager = new productManagerDB;
const cartManager = new CartManagerDB;

router.get("/products", async (req, res) => {
  let products = await productManager.getProducts(req);
  let carts = await cartManager.getCarts();
  res.render("products", { products, carts, styles: "products.css" });
});

router.get("/carts/:cid", async (req, res) => {
  let cart = await cartManager.getCartView(req, res);
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await productManager.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;
