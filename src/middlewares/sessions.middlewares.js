import passport from "passport";
import jwt from "jsonwebtoken";

export const authorizeUser = (authorizedRoles) => {
  return async (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!authorizedRoles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
};

export const verifyToken = (req, res, next) => {
  let token = req.cookies.idToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, config.secretKey, (error, credentials) => {
    if (error) return res.sendStatus(401);
    req.user = credentials.user;
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
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