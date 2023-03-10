import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import CartManager from "../managers/CartManager.js";
import path from "path";

const router = Router();
const cm = new CartManager(path.join(__dirname, "../files/carts.json"));

router.post("/", (req, res) => cm.addCart(req, res));

router.get("/:cid", (req, res) => cm.getCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cm.addProduct(req, res));

export default router;