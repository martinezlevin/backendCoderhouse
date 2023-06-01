import passport from "passport";

export const authorizeUser = (authorizedRoles) => {
  return async (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!authorizedRoles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        if (!info) {
          return res.status(401).send("Sin autenticar");
        } else {
          return res.status(401).send({ error: info.messages || info.toString() });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};