import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import { messagesModel } from "../models/messages.model.js";
import { usersModel } from "../models/users.model.js";

export class CartsMongoDao {
  async createCart() {
    return await cartsModel.create({ alias: "Mi compra" });
  }
  async getCart(cid) {
    return await cartsModel.findOne({ _id: cid }).populate("products.productId");
  }
  async addProduct(cid, pid, qty) {
    return await cartsModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: qty } } });
  }
  async deleteProduct(cid, pid) {
    return await cartsModel.updateOne({ _id: cid }, { $pull: { products: { productId: pid } } });
  }
  async updateProductQty(cid, pid, qty) {
    return await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": qty } });
  }
  async deleteProducts(cid) {
    return await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
  }
}

export class ProductsMongoDao {
  async getProducts(query, options) {
    return await productsModel.paginate(query, options);
  }
  async getProduct(pid) {
    return await productsModel.findOne({ _id: pid });
  }
  async getProductByCode(code) {
    return await productsModel.findOne({ code: code });
  }
  async deleteProduct(pid) {
    return await productsModel.deleteOne({ _id: pid });
  }
  async createProduct(product) {
    return await productsModel.create(product);
  }
  async updateProduct(pid, field, value) {
    return await productsModel.updateOne({ _id: pid }, { $set: { [field]: value } });
  }
}

export class MessagesMongoDao {
  async getMessages() {
    return await messagesModel.find();
  }
  async addMessage(data) {
    return await messagesModel.create(data);
  }
}

export class UsersMongoDao {
  async getUser(field, value) {
    return await usersModel.findOne({ [field]: value });
  }
  async createUser(user) {
    return await usersModel.create(user);
  }
  async updateUser(field, value, data) {
    return await usersModel.updateOne({ [field]: value }, data);
  }
}