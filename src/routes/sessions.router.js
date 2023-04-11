import { Router } from "express";
import passport from "passport";

const router = Router();
export default router;

router.get("/github", passport.authenticate("github", {}), (req, res) => {

})

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  let { firstName, lastName, email, age, role } = req.user;

  req.session.user = {
    firstName,
    lastName,
    email,
    age,
    role,
  };

  res.redirect("/products");
})

router.post("/logup", passport.authenticate("logup", { failureRedirect: "/logup", successRedirect: "/login" }), async (req, res) => {});

router.post("/login", passport.authenticate("login", { failureRedirect: "/login" }), async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  
  let { firstName, lastName, email, age, role } = req.user;

  req.session.user = {
    firstName,
    lastName,
    email,
    age,
    role,
  };

  res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.redirect("/login");
    }
  });
});