import { Router } from "express";
import cartsApiController from "../controllers/cartsApi.controller.js";

const router = Router();

router.get("/:cid", cartsApiController.getCart);

router.post("/:cid/product/:pid", cartsApiController.addProduct);

router.delete("/:cid/product/:pid", cartsApiController.deleteProduct);

router.delete("/:cid", cartsApiController.deleteProducts);

router.post("/:cid/purchase", cartsApiController.sendOrder);

export default router;