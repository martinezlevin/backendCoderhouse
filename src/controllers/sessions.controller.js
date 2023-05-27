import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usersService, tokensService } from "../dao/factory.js";
import { createFakePass, createHash, isValidPassword } from "../utils/utils.js";
import mailer from "../utils/mailer.js";

class SessionsController {
  async getCurrent(req, res) {
    let result = await usersService.getCurrentById(req.user.id);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result });
    } else {
      return res.status(500).send({ status: "Error.", error: "Error al intentar obtener los datos del usuario actual." });
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

  async passwordResetInit(req, res) {
    let { email } = req.body;
    let user = await usersService.getByEmail(email);
    if (!user) return res.status(400).send({ status: "Error.", error: "Usuario no encontrado." });
    let token = createFakePass();
    let result =
      (await tokensService.updateResetToken(email, createHash(token))) || (await tokensService.addResetToken(email, createHash(token)));
    if (result) {
      mailer.sendPassResetLink(email, token);
      return res.status(201).send({ status: "Éxito.", result: "Correo electrónico enviado con éxito, favor de verificar su bandeja de entrada." });
    } else {
      return res.status(500).send({ status: "Error.", error: "Error al intentar agregar el token de reinicio." });
    }
  }

  async passwordResetEnd(req, res) {
    let { email, token, newPassword } = req.body;
    let dbToken = await tokensService.getResetToken(email);
    if (!dbToken) return res.status(400).send({ status: "Error.", error: "Enlace expirado." });
    dbToken.password = dbToken.token;
    if (!isValidPassword(token, dbToken)) return res.status(400).send({ status: "Error.", error: "Token no valido." });
    let user = await usersService.getByEmail(email);
    if (isValidPassword(newPassword, user))
      return res.status(400).send({ status: "Error.", error: "Contraseña igual" });
    let update = { password: createHash(newPassword) };
    let result = await usersService.updateByEmail(email, update);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result: "Restablecimiento de contraseña con éxito." });
    } else {
      return res.status(500).send({ status: "Error.", error: "Error al intentar restablecer la contraseña." });
    }
  }

  async toggleRole(req, res) {
    let user = await usersService.getById(req.params.uid);
    if (!user) return res.status(400).send({ status: "Error.", error: "Usuario no encontrado." });
    if (user.role === "Administrador") return res.status(400).send({ status: "Error.", error: "El usuario es administrador." });
    let result;
    if (user.role === "Usuario") result = await usersService.updateById(req.params.uid, { role: "Premium" });
    if (user.role === "Premium") result = await usersService.updateById(req.params.uid, { role: "Usuario" });
    if (result) {
      return res.status(200).send({ status: "Éxito.", result: "Rol de usuario actualizado." });
    } else {
      return res.status(500).send({ status: "Error.", error: "Error al intentar actualizar la función del usuario." });
    }
  }
}

const sessionsController = new SessionsController();
export default sessionsController;