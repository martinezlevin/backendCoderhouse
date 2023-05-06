import { config } from "../config/config.js";
import { DB } from "../utils/utils.js";

export let cartsDao;
export let productsDao;
export let messagesDao;
export let usersDao;

switch (config.persistence) {
  case "mongo":
    DB.connectDB();
    let { CartsMongoDao, ProductsMongoDao, MessagesMongoDao, UsersMongoDao } = await import("./mongo.dao.js");
    cartsDao = new CartsMongoDao();
    productsDao = new ProductsMongoDao();
    messagesDao = new MessagesMongoDao();
    usersDao = new UsersMongoDao();
    break;

  case "memory":
    let { CartsMemoryDao, ProductsMemoryDao, MessagesMemoryDao, UsersMemoryDao } = await import("./memory.dao.js");
    cartsDao = new CartsMemoryDao();
    productsDao = new ProductsMemoryDao();
    messagesDao = new MessagesMemoryDao();
    usersDao = new UsersMemoryDao();
    break;

  default:
    break;
}