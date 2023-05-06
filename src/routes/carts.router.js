import { Router } from "express";
import cartsApiController from "../controllers/cartsApi.controller.js";

const router = Router();

router.get("/:cid", (req, res) => cartsApiController.getCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cartsApiController.addProduct(req, res));

router.delete("/:cid/product/:pid", (req, res) => cartsApiController.deleteProduct(req, res));

router.delete("/:cid", (req, res) => cartsApiController.deleteProducts(req, res));

export default router;