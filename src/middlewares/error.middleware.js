export const errorMiddleware = (error, req, res, next) => {
    if (error) {
      req.logger.info(`${new Date().toLocaleString()} - ${error.message} - ${error.info}`);
      res.setHeader("Content-Type", "application/json");
      return res.status(error.code).json({ error: `${error.message}. ${error.info}` });
    }
    next();
  };