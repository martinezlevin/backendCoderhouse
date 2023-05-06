import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import productsApiController from "../controllers/productsApi.controller.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";

const router = Router();

router.get("/", (req, res) => productsApiController.getProducts(req, res));

router.get("/:pid", (req, res) => productsApiController.getProductById(req, res));

router.post("/", addProductMid, (req, res) => productsApiController.addProduct(req, res));

router.put("/:pid", updateProductMid, (req, res) => productsApiController.updateProduct(req, res));

router.delete("/:pid", (req, res) => productsApiController.deleteProduct(req, res));

export default router;