export const setReqIsView = (req, res, next) => {
    req.isView = true;
    next();
  };