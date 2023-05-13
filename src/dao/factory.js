import { config } from "../config/config.js";
import { DB } from "../utils/utils.js";

export let cartsService;
export let productsService;
export let messagesService;
export let usersService;
export let ticketsService;

switch (config.persistence) {
  case "mongo":
    DB.connectDB();
    let {
      CartsMongoDao,
      ProductsMongoDao,
      MessagesMongoDao,
      UsersMongoDao,
      TicketsMongoDao
    } = await import("./mongo.dao.js");
    let {
      CartsMongoService,
      ProductsMongoService,
      MessagesMongoService, UsersMongoService,
      TicketsMongoService
    } = await import("../services/mongo.service.js");
    cartsService = new CartsMongoService(new CartsMongoDao());
    productsService = new ProductsMongoService(new ProductsMongoDao());
    messagesService = new MessagesMongoService(new MessagesMongoDao());
    usersService = new UsersMongoService(new UsersMongoDao());
    ticketsService = new TicketsMongoService(new TicketsMongoDao);
    break;

  case "memory":
    let {
      CartsMemoryDao,
      ProductsMemoryDao,
      MessagesMemoryDao,
      UsersMemoryDao,
      TicketsMemoryDao
    } = await import("./memory.dao.js");
    let {
      CartsMemoryService,
      ProductsMemoryService,
      MessagesMemoryService,
      UsersMemoryService,
      TicketsMemoryService
    } = await import("../services/memory.service.js");
    cartsService = new CartsMemoryService(new CartsMemoryDao());
    productsService = new ProductsMemoryService(new ProductsMemoryDao());
    messagesService = new MessagesMemoryService(new MessagesMemoryDao());
    usersService = new UsersMemoryService(new UsersMemoryDao());
    ticketsService = new TicketsMemoryService(new TicketsMemoryDao());
    break;

  default:
    break;
}