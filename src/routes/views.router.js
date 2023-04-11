import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";
import { authLoggedIn } from "../middlewares/session.middlewares.js";
import { authLoggedOut } from "../middlewares/session.middlewares.js";

const router = Router();
const pm = new productManagerDB;
const cm = new CartManagerDB;

router.get("/logup", authLoggedOut, async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("logup");
});

router.get("/login", authLoggedOut, async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login")
})

router.get("/products", authLoggedIn, async (req, res) => {
  let products = await pm.getProducts(req);
  let carts = await cm.getCarts();
  let user = req.session.user;
  res.render("products", { products, carts, user, styles: "products.css" });
});

router.get("/carts/:cid", authLoggedIn, async (req, res) => {
  let cart = await cm.getCartView(req, res);
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", authLoggedIn, async (req, res) => {
  let products = await pm.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", authLoggedIn, async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;