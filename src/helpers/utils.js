import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const privateKey = "mySecretKey";
const createToken = (user) => {
  return jwt.sign({ user }, privateKey, { expiresIn: "24h" });
};
const authToken = (req, res, next) => {
  let token = req.cookies.idToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, privateKey, (error, credentials) => {
    if (error) return res.sendStatus(401);
    req.user = credentials.user;
    next();
  });
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        if (!info) {
          return res.status(401).send("unauthenticated");
        } else {
          return res.status(401).send({ error: info.messages || info.toString() });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export { __dirname, createHash, isValidPassword, createToken, authToken, passportCall };