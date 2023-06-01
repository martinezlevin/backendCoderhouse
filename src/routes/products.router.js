import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import productsApiController from "../controllers/productsApi.controller.js";
import { verifyProductProperties } from "../middlewares/products.middleware.js";

const router = Router();

router.get("/:pid", productsApiController.getProduct);

router.get("/", productsApiController.getProducts);

router.post("/", verifyProductProperties, productsApiController.addProduct);

router.put("/:pid", verifyProductProperties, productsApiController.updateProduct);

router.delete("/:pid", productsApiController.deleteProduct);

export default router;