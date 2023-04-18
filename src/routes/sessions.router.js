import { Router } from "express";
import passport from "passport";
import { usersModel } from "../dao/models/users.model.js";
import { isValidPassword, createToken, passportCall } from "../helpers/utils.js";

const router = Router();
export default router;

router.get("/current", passportCall("jwt"), (req, res) => {
  res.send(req.user);
});

router.get("/github", passport.authenticate("github", { session: false }), (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { session: false, failureRedirect: "/login" }), (req, res) => {
  let { firstName, lastName, email, age, role } = req.user;

  /* req.session.user = {
    firstName,
    lastName,
    email,
    age,
    role,
  };
  res.redirect("/products");  */
  let user = { firstName, lastName, email, age, role };

  let token = createToken(user);

  res.cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true }).redirect("/products");
});

router.post("/logup", passport.authenticate("logup", { session: false, failureRedirect: "/logup", successRedirect: "/login" }), async (req, res) => {});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) return res.sendStatus(401);

  let currentUser = await usersModel.findOne({ email: email });
  if (!currentUser) return res.sendStatus(401);
  if (!isValidPassword(password, currentUser)) return res.sendStatus(401);

  let { firstName, lastName, age } = currentUser;
  let role = email === "adminCoder@coder.com" && password === "adminCod3r123" ? "admin" : "user";
  let user = {
    firstName,
    lastName,
    email,
    age,
    role,
  };
  let token = createToken(user);

  res.cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true }).sendStatus(200);
});

router.get("/logout", (req, res) => {
  res.clearCookie("idToken").sendStatus(200);
});