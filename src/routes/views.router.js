import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";
import passport from "passport";

const router = Router();
const pm = new productManagerDB;
const cm = new CartManagerDB;

router.get("/logup"/* , authLoggedOut */, async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("logup");
});

router.get("/login"/* , authLoggedOut */, async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login")
})

//router.get("/products"/* , authLoggedIn */, authToken, async (req, res) => {
router.get("/products", passport.authenticate("jwt",{session: false}), async (req, res) => {
  let products = await pm.getProducts(req);
  let carts = await cm.getCarts();
  let user = req.user;
  res.render("products", { products, carts, user, styles: "products.css" });
});

//router.get("/carts/:cid" /* , authLoggedIn */, authToken, async (req, res) => {
router.get("/carts/:cid", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let cart = await cm.getCartView(req, res);
  res.render("cart", { cart, styles: "cart.css" });
});

//router.get("/realtimeproducts" /* , authLoggedIn */, authToken, async (req, res) => {
router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let products = await pm.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

//router.get("/chat" /* , authLoggedIn */, authToken, async (req, res) => {
router.get("/chat", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;