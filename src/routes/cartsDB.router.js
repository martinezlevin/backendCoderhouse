import { Router } from "express";
import CartManagerDB from "../dao/cartManagerDB.js";

const router = Router();
const cartManager = new CartManagerDB;

router.get("/:cid", (req, res) => cartManager.getCart(req, res));

router.post("/", (req, res) => cartManager.addCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cartManager.addProduct(req, res));

router.put("/:cid", (req, res) => cartManager.addProducts(req, res));

router.delete("/:cid", (req, res) => cartManager.deleteProducts(req, res));

router.delete("/:cid/product/:pid", (req, res) => cartManager.deleteProduct(req, res));


export default router;
