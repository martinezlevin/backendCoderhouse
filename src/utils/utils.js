import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import mongoose from "mongoose";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const createToken = (user) => {
  return jwt.sign({ user }, config.secretKey, { expiresIn: "24h" });
};
const authToken = (req, res, next) => {
  let token = req.cookies.idToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, config.secretKey, (error, credentials) => {
    if (error) return res.sendStatus(401);
    req.user = credentials.user;
    next();
  });
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        if (!info) {
          return res.status(401).send("no autenticado");
        } else {
          return res.status(401).send({ error: info.messages || info.toString() });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

class DB {
  constructor() {
    mongoose
    .connect(config.mongoUrl)
    .then(() => console.log("Éxito de la conexión a la base de datos"))
    .catch((error) => console.log(`La conexión a la base de datos falla. Error: ${error}`));
  }

  static #instance;
  
  static connectDB() {
    if (DB.#instance) {
      console.log("Base de datos ya conectada");
      return DB.#instance;
    } else {
      DB.#instance = new DB();
      return DB.#instance;
    }
  }
}

export { __dirname, createHash, isValidPassword, createToken, authToken, passportCall, DB };