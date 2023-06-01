export const errorMiddleware = (error, req, res, next) => {
  if (error) {
    req.logger.error(`${new Date().toLocaleString()} - ${error.message}`);
    return res.status(500).send({ status: "error", error: "server error" });
  }
  next();
};