import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import CartManagerFS from "../dao/cartManagerFS.js";
import path from "path";

const router = Router();
const cm = new CartManagerFS(path.join(__dirname, "../files/carts.json"));

router.post("/", (req, res) => cm.addCart(req, res));

router.get("/:cid", (req, res) => cm.getCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cm.addProduct(req, res));

export default router;