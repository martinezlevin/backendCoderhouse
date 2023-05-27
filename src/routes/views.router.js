import { Router } from "express";
import productsViewController from "../controllers/productsView.controller.js";
import cartsViewController from "../controllers/cartsView.controller.js";
import messagesController from "../controllers/messages.controller.js";
import { authorizeUser, passportCall } from "../middlewares/sessions.middleware.js";

const router = Router();

router.get("/logup", (req, res) => {
  if (req.cookies.idToken) return res.redirect("/products");
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("logup", { styles: "logup.css" });
});

router.get("/login", (req, res) => {
  if (req.cookies.idToken) return res.redirect("/products");
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login", { styles: "login.css" });
});

router.get("/forgotPassword", (req, res) => {
  if (req.cookies.idToken) return res.redirect("/products");
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("forgotPassword", { styles: "forgotPassword.css" });
})

router.get("/passwordreset/:email/:token", (req, res) => {
  if (req.cookies.idToken) return res.redirect("/products");
  let { email, token } = req.params;
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("passwordReset", { email, token, styles: "passwordReset.css" });
})

router.get("/products", passportCall("jwt"), authorizeUser(["Usuario", "Premium", "Administrador"]), async (req, res) => {
  let products = await productsViewController.getProducts(req.query);
  let user = req.user;
  res.setHeader("Content-Type", "text/html");
  res.render("products", { products, user, styles: "products.css" });
});

router.get("/carts/:cid", passportCall("jwt"), authorizeUser(["Usuario", "Premium", "Administrador"]), async (req, res) => {
  let cart = await cartsViewController.getCart(req.params.cid);
  res.setHeader("Content-Type", "text/html");
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", passportCall("jwt"), authorizeUser(["Premium", "Administrador"]), async (req, res) => {
  let products = await productsViewController.getProducts(req.query);
  res.setHeader("Content-Type", "text/html");
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", passportCall("jwt"), authorizeUser(["Usuario", "Premium", "Administrador"]), async (req, res) => {
  let user = req.user;
  let messages = await messagesController.getMessages();
  res.setHeader("Content-Type", "text/html");
  res.render("chat", { user, messages, styles: "chat.css" });
});

export default router;