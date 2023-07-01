import { Router } from "express";
import {authorizeUser, passportCall,} from "../middlewares/sessions.middleware.js";
import sessionsController from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

sessionsRouter.get(
  "/current",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  sessionsController.getCurrent
);

sessionsRouter.get("/github", passportCall("github"));

sessionsRouter.get(
  "/githubcallback",
  passportCall("github"),
  sessionsController.altLogin
);

sessionsRouter.post("/logup", passportCall("logup"), sessionsController.logup);

sessionsRouter.post("/login", passportCall("login"), sessionsController.login);

sessionsRouter.get("/logout", sessionsController.logout);

sessionsRouter.post("/passwordresetinit", sessionsController.passwordResetInit);

sessionsRouter.post("/passwordresetend", sessionsController.passwordResetEnd);

sessionsRouter.post(
  "/premium/:uid",
  passportCall("jwt"),
  authorizeUser(["admin"]),
  sessionsController.toggleRole
);

export default sessionsRouter;