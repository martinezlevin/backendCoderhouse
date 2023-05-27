import { Router } from "express";
import { passportCall } from "../middlewares/sessions.middleware.js";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.get("/current", passportCall("jwt"), sessionsController.getCurrent);

router.get("/github", passportCall("github"), sessionsController.github);

router.get("/githubcallback", passportCall("github"), sessionsController.login);

router.post("/logup", passportCall("logup"), sessionsController.logup);

router.post("/login", passportCall("login"), sessionsController.login);

router.get("/logout", sessionsController.logout);

router.post("/passwordresetinit", sessionsController.passwordResetInit);

router.post("/passwordresetend", sessionsController.passwordResetEnd);

router.post("/premium/:uid", sessionsController.toggleRole);

export default router;