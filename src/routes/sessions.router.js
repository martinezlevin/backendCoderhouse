import { Router } from "express";
import { passportCall } from "../middlewares/sessions.middlewares.js";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.get("/current", passportCall("jwt"), (req, res) => sessionsController.getCurrent(req, res));

router.get("/github", passportCall("github"), (req, res) => sessionsController.github(req, res));

router.get("/githubcallback", passportCall("github"), (req, res) => sessionsController.login(req, res));

router.post("/logup", passportCall("logup"), (req, res) => sessionsController.logup(req, res));

router.post("/login", passportCall("login"), (req, res) => sessionsController.login(req, res));

router.get("/logout", (req, res) => sessionsController.logout(req, res));

export default router;