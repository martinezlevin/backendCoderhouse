import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import {
  authorizeUser,
  passportCall,
} from "../middlewares/sessions.middleware.js";

const cartsRouter = Router();

cartsRouter.get(
  "/:cid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.getCart
);

cartsRouter.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.addProduct
);

cartsRouter.delete(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.deleteProduct
);

cartsRouter.delete(
  "/:cid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.deleteProducts
);

export default cartsRouter;