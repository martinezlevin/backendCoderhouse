import { Router } from "express";
import {
  authorizeUser,
  passportCall,
} from "../middlewares/sessions.middleware.js";
import viewsController from "../controllers/views.controller.js";

const viewsRouter = Router();

viewsRouter.get("/logup", viewsController.logup);

viewsRouter.get("/login", viewsController.login);

viewsRouter.get("/error", viewsController.error);

viewsRouter.get("/forgotPassword", viewsController.forgotPassword);

viewsRouter.get("/passwordreset/:email/:token", viewsController.passwordReset);

viewsRouter.get(
  "/products",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  viewsController.products
);

viewsRouter.get(
  "/carts/:cid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  viewsController.cart
);

viewsRouter.get(
  "/products_manager",
  passportCall("jwt"),
  authorizeUser(["premium", "admin"]),
  viewsController.realTimeProducts
);

export default viewsRouter;