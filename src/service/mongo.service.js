import { CartDto } from "../dto/carts.dto.js";
import { CurrentUserDto } from "../dto/users.dto.js";

export class CartsMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async create(cartData) {
    let docs = cartData;
    return await this.dao.create(docs);
  }
  async getById(cartId) {
    let conditions = { _id: cartId };
    let result = await this.dao.getOne(conditions);
    return new CartDto(result);
  }
  async addProduct(cartId, productId, productQty) {
    let filter = { _id: cartId };
    let update = { $push: { products: { productId: productId, quantity: productQty } } };
    return await this.dao.updateOne(filter, update);
  }
  async deleteProduct(cartId, productId) {
    let filter = { _id: cartId };
    let update = { $pull: { products: { productId: productId } } };
    return await this.dao.updateOne(filter, update);
  }
  async updateProductQty(cartId, productId, productQty) {
    let filter = { _id: cartId, "products.productId": productId };
    let update = { $inc: { "products.$.quantity": productQty } };
    return await this.dao.updateOne(filter, update);
  }
  async deleteProducts(cartId) {
    let filter = { _id: cartId };
    let update = { $set: { products: [] } };
    return await this.dao.updateOne(filter, update);
  }
  async sendOrder(cartID, purchaser) {}
}

export class ProductsMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async getPaginated(query) {
    let { category, status, limit, page, sort } = query;
    let filter = {};
    let options = { limit: 10, page: 1 };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (limit) options.limit = limit;
    if (page) options.page = page;
    if (sort) options.sort = { price: sort };
    return await this.dao.getPaginated(filter, options);
  }
  async getById(productId) {
    let conditions = { _id: productId };
    return await this.dao.getOne(conditions);
  }
  async getByCode(productCode) {
    let conditions = { code: productCode };
    return await this.dao.getOne(conditions);
  }
  async deleteById(productId) {
    let conditions = { _id: productId };
    return await this.dao.deleteOne(conditions);
  }
  async create(productData) {
    let docs = productData;
    return await this.dao.create(docs);
  }
  async updateById(productId, update) {
    let filter = { _id: productId };
    return await this.dao.updateOne(filter, update);
  }
  async updateStockById(productId, quantity) {
    let filter = { _id: productId };
    let update = { $inc: { stock: quantity } };
    return await this.dao.updateOne(filter, update);
  }
}

export class MessagesMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async get() {
    return await this.dao.get();
  }
  async send(messageData) {
    let docs = messageData;
    return await this.dao.create(docs);
  }
}

export class UsersMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async getById(userId) {
    let conditions = { _id: userId };
    return await this.dao.getOne(conditions);
  }
  async getByEmail(userEmail) {
    let conditions = { email: userEmail };
    return await this.dao.getOne(conditions);
  }
  async getCurrentByEmail(userEmail) {
    let conditions = { email: userEmail };
    let result = await this.dao.getOne(conditions);
    return new CurrentUserDto(result);
  }
  async create(userData) {
    let docs = { ...userData, lastOrder: 100 };
    return await this.dao.create(docs);
  }
  async updateByEmail(email, update) {
    let filter = { email: email };
    return await this.dao.updateOne(filter, update);
  }
}

export class TicketsMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async send(ticketData) {
    let docs = ticketData;
    return await this.dao.create(docs);
  }
}