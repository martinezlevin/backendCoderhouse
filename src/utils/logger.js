import winston from "winston";
import { currentEnvironment } from "../config/config.js";

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "magenta",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "white",
    debug: "grey",
  },
};

let currentTransports;
switch (currentEnvironment) {
  case "development":
    currentTransports = [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
      }),
    ];
    break;
  case "staging":
    currentTransports = [new winston.transports.Console({ level: "debug" })];
    break;
  case "production":
    currentTransports = [
      new winston.transports.Console({ level: "info" }),
      new winston.transports.File({ level: "error", filename: "./src/files/logs/errors.log" }),
    ];
    break;
  default:
    currentTransports = [new winston.transports.Console({ level: "debug" })];
    break;
}

export const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: currentTransports,
});