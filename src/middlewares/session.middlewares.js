export const authLoggedIn = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
  };
  
  export const authLoggedOut = (req, res, next) => {
    if (req.session.user) return res.redirect("/products");
    next();
  };