import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import productManagerDB from "../dao/productManagerDB.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";

const router = Router();
const product = new productManagerDB;

router.get("/", async (req, res) => {
  let products = await product.getProducts(req.query.limit);
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ products });
});

router.get("/:pid", (req, res) => product.getProductById(req, res));

router.post("/", addProductMid, (req, res) => product.addProduct(req, res));

router.put("/:pid", updateProductMid, (req, res) => product.updateProduct(req, res));

router.delete("/:pid", (req, res) => product.deleteProduct(req, res));

export default router;