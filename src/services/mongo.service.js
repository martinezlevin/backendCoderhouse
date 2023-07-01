import moment from "moment-timezone";
import { CartDto } from "../dto/carts.dto.js";
import { CurrentUserDto } from "../dto/users.dto.js";

export class CartsMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async create() {
    return await this.dao.create();
  }
  async getById(cartId) {
    let conditions = { _id: cartId };
    let result = await this.dao.getOne(conditions);
    return result ? new CartDto(result) : null;
  }
  async addProduct(cartId, productId, productQty) {
    let filter = { _id: cartId };
    let update = {
      $push: { products: { product: productId, quantity: productQty } },
    };
    return await this.dao.updateOne(filter, update);
  }
  async deleteProduct(cartId, productId) {
    let filter = { _id: cartId };
    let update = { $pull: { products: { product: productId } } };
    return await this.dao.updateOne(filter, update);
  }
  async updateProductQty(cartId, productId, productQty) {
    let filter = { _id: cartId, "products.product": productId };
    let update = { $inc: { "products.$.quantity": productQty } };
    return await this.dao.updateOne(filter, update);
  }
  async deleteProducts(cartId) {
    let filter = { _id: cartId };
    let update = { $set: { products: [] } };
    return await this.dao.updateOne(filter, update);
  }
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
  async getCurrentById(userId) {
    let conditions = { _id: userId };
    let result = await this.dao.getOne(conditions);
    return result ? new CurrentUserDto(result) : null;
  }
  async create(userData) {
    let docs = { ...userData, lastOrder: 100 };
    return await this.dao.create(docs);
  }
  async updateById(userId, update) {
    let filter = { _id: userId };
    return await this.dao.updateOne(filter, update);
  }
  async updateByEmail(userEmail, update) {
    let filter = { email: userEmail };
    return await this.dao.updateOne(filter, update);
  }
}

export class OrdersMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async create(orderData) {
    let docs = orderData;
    return await this.dao.create(docs);
  }
  async get(reqBody) {
    let { status, purchasers, fromDateTime, toDateTime, limit } = reqBody;
    let nowUtc = moment().utc().format();
    let oneDayAgoUtc = moment().utc().subtract(1, "days").format();
    let filter = {
      createdAt: { $gte: oneDayAgoUtc, $lte: nowUtc },
    };
    let projection = {};
    let options = {};
    if (status) filter.status = status;
    if (purchasers) filter.purchaser = { $in: purchasers};
    if (fromDateTime) filter.createdAt.$gte = fromDateTime;
    if (toDateTime) filter.createdAt.$lte = toDateTime;
    if (limit) options.limit = limit;
    return await this.dao.get(filter, projection, options);
  }
  async getByCode(orderCode) {
    let conditions = { code: orderCode };
    return await this.dao.getOne(conditions);
  }
  async updateByCode(orderCode, update) {
    let filter = { code: orderCode };
    return await this.dao.updateOne(filter, update);
  }
}

export class TokensMongoService {
  constructor(dao) {
    this.dao = dao;
  }
  async addResetToken(userEmail, token) {
    let docs = {
      email: userEmail,
      token,
      type: "reset",
    };
    return await this.dao.create(docs);
  }
  async updateResetToken(userEmail, newToken) {
    let filter = { email: userEmail, type: "reset" };
    let update = { token: newToken };
    return await this.dao.updateOne(filter, update);
  }
  async getResetToken(userEmail) {
    let conditions = { email: userEmail, type: "reset" };
    return await this.dao.getOne(conditions);
  }
}