import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usersService } from "../dao/factory.js";

class SessionsController {
  async getCurrent(req, res) {
    let result = await usersService.getCurrentByEmail(req.user.email);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result });
    } else {
      return res.status(500).send({ status: "Error.", error: "Algo salió mal, inténtalo de nuevo más tarde." });
    }
  }

  async github(req, res) {}

  async logup(req, res) {
    res.redirect("/login");
  }

  async login(req, res) {
    const createToken = (user) => {
      return jwt.sign({ user }, config.secretKey, { expiresIn: "24h" });
    };
    let token = createToken(req.user);
    let cookieOptions = { maxAge: 1000 * 60 * 60, httpOnly: true };
    res.cookie("idToken", token, cookieOptions).redirect("/products");
  }

  async logout(req, res) {
    res.clearCookie("idToken").redirect("/login");
  }
}

const sessionsController = new SessionsController();
export default sessionsController;