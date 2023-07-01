import { config } from "../config/config.js";
import { DB } from "../utils/utils.js";

export let cartsService;
export let productsService;
export let usersService;
export let ordersService;
export let tokensService;

switch (config.persistence) {
  case "mongo":
    DB.connectDB();
    let {
      CartsMongoDao,
      ProductsMongoDao,
      UsersMongoDao,
      OrdersMongoDao,
      TokensMongoDao,
    } = await import("./mongo.dao.js");
    let {
      CartsMongoService,
      ProductsMongoService,
      UsersMongoService,
      OrdersMongoService,
      TokensMongoService,
    } = await import("../services/mongo.service.js");
    cartsService = new CartsMongoService(new CartsMongoDao());
    productsService = new ProductsMongoService(new ProductsMongoDao());
    usersService = new UsersMongoService(new UsersMongoDao());
    ordersService = new OrdersMongoService(new OrdersMongoDao());
    tokensService = new TokensMongoService(new TokensMongoDao());
    break;

  case "memory":
    let {
      CartsMemoryDao,
      ProductsMemoryDao,
      UsersMemoryDao,
      OrdersMemoryDao,
      TokensMemoryDao,
    } = await import("./memory.dao.js");
    let {
      CartsMemoryService,
      ProductsMemoryService,
      UsersMemoryService,
      OrdersMemoryService,
      TokensMemoryService,
    } = await import("../services/memory.service.js");
    cartsService = new CartsMemoryService(new CartsMemoryDao());
    productsService = new ProductsMemoryService(new ProductsMemoryDao());
    usersService = new UsersMemoryService(new UsersMemoryDao());
    ordersService = new OrdersMemoryService(new OrdersMemoryDao());
    tokensService = new TokensMemoryService(new TokensMemoryDao());
    break;

  default:
    break;
}
