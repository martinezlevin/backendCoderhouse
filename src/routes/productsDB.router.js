import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import productManagerDB from "../dao/productManagerDB.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";

const router = Router();
const pm = new productManagerDB();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let response = await pm.getProducts(req);
  if (response.status === "success") {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

router.get("/:pid", (req, res) => pm.getProductById(req, res));

router.post("/", addProductMid, (req, res) => pm.addProduct(req, res));

router.put("/:pid", updateProductMid, (req, res) => pm.updateProduct(req, res));

router.delete("/:pid", (req, res) => pm.deleteProduct(req, res));

export default router;