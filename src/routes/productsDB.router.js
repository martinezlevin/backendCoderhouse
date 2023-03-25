import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import productManagerDB from "../dao/productManagerDB.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";

const router = Router();
const productManager = new productManagerDB();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let response = await productManager.getProducts(req.query);
  if (response.status === "success") {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

router.get("/:pid", (req, res) => productManager.getProductById(req, res));

router.post("/", addProductMid, (req, res) => productManager.addProduct(req, res));

router.put("/:pid", updateProductMid, (req, res) => productManager.updateProduct(req, res));

router.delete("/:pid", (req, res) => productManager.deleteProduct(req, res));

export default router;
