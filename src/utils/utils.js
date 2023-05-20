import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export class DB {
  constructor() {
    mongoose
      .connect(config.mongoUrl)
      .then(() => console.log("Éxito en la conexión a la base de datos."))
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

export const createFakeProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(5),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(0.9),
    stock: faker.number.int({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    thumbnails: [
      faker.image.urlPlaceholder({ format: "jpeg" }),
      faker.image.urlPlaceholder({ format: "jpeg" }),
      faker.image.urlPlaceholder({ format: "jpeg" }),
    ],
  };
};