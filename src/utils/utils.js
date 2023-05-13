import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export class DB {
  constructor() {
    mongoose
    .connect(config.mongoUrl)
    .then(() => console.log("DB connection success"))
    .catch((error) => console.log(`La conexión a la base de datos falla. Error: ${error}`));
  }

  static #instance;
  
  static connectDB() {
    if (DB.#instance) {
      console.log("Base de datos ya conectada.");
      return DB.#instance;
    } else {
      DB.#instance = new DB();
      return DB.#instance;
    }
  }
}