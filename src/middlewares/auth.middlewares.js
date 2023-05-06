export const authUser = (authRoles) => {
    return async (req, res, next) => {
      if (!req.user) return res.sendStatus(401);
      if (!authRoles.includes(req.user.role)) return res.sendStatus(403);
      next()
    };
  };