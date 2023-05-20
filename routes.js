import { Router } from "express";
import { createToken, passportCall } from "./src/utils/utils.js";
import { passportCall } from "./src/middlewares/sessions.middlewares.js";
import sessionsController from "./src/controllers/sessions.controller.js";

const router = Router();

router.get("/current", passportCall("jwt"), (req, res) => {
  res.send(req.user);
});
router.get("/current", passportCall("jwt"), (req, res) => sessionsController.getCurrent(req, res));

router.get("/github", passportCall("github"), (req, res) => {});
router.get("/github", passportCall("github"), (req, res) => sessionsController.github(req, res));

router.get("/githubcallback", passportCall("github"), (req, res) => {
  let token = createToken(req.user);
  res.cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true }).redirect("/products");
});
router.get("/githubcallback", passportCall("github"), (req, res) => sessionsController.login(req, res));

router.post("/logup", passportCall("logup"), (req, res) => {
  res.redirect("/login");
});
router.post("/logup", passportCall("logup"), (req, res) => sessionsController.logup(req, res));

router.post("/login", passportCall("login"), (req, res) => {
  let token = createToken(req.user);
  res.cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true }).redirect("/products");
});
router.post("/login", passportCall("login"), (req, res) => sessionsController.login(req, res));

router.get("/logout", (req, res) => {
  res.clearCookie("idToken").redirect("/login");
});
router.get("/logout", (req, res) => sessionsController.logout(req, res));

export default router;