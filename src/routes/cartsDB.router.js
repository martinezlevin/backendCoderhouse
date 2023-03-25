import { Router } from "express";
import CartManagerDB from "../dao/cartManagerDB.js";

const router = Router();
const cm = new CartManagerDB;

router.get("/:cid", (req, res) => cm.getCart(req, res));

router.post("/", (req, res) => cm.addCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cm.addProduct(req, res));

router.put("/:cid", (req, res) => cm.addProducts(req, res));

router.delete("/:cid/product/:pid", (req, res) => cm.deleteProduct(req, res));

router.delete("/:cid", (req, res) => cm.deleteProducts(req, res));

export default router;
