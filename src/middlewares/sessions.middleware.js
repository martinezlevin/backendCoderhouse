import passport from "passport";

export const authorizeUser = (authorizedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return req.isView
        ? res.status(401).redirect("/login")
        : res.sendStatus(401);
    }
    if (!authorizedRoles.includes(req.user.role)) {
      return req.isView
        ? res.status(403).redirect("back")
        : res.sendStatus(403);
    }
    next();
  };
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
      if (req.isView && (error || !user)) {
        return res.status(401).redirect("/login");
      }
      if (error) {
        return next(error);
      }
      if (!user) {
        let resInfo = {
          error: info?.messages || info?.toString() || "unauthenticated",
        };
        return res.status(401).send(resInfo);
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};