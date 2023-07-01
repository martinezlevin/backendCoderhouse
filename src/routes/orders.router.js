import { Router } from "express";
import ordersController from "../controllers/orders.controller.js";
import {
  authorizeUser,
  passportCall,
} from "../middlewares/sessions.middleware.js";

const ordersRouter = Router();

ordersRouter.post(
  "/:cid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  ordersController.sendOrder
);

ordersRouter.get(
  "/:oc",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"],
  ordersController.getOrder)
);

ordersRouter.get(
  "/",
  passportCall("jwt"),
  authorizeUser(["admin"],
  ordersController.getOrders)
);

ordersRouter.put(
  "/:oc",
  passportCall("jwt"),
  authorizeUser(["admin"],
  ordersController.updateOrder)
);

//PUT OTHER PATHS

export default ordersRouter;