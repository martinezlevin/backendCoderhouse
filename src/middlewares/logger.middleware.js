import { logger } from "../utils/logger.utils.js";

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};