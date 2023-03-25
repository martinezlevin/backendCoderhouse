import { cartsModel } from "./models/carts.model.js";

export default class CartManagerDB {
  async getCarts() {
    let carts = await cartsModel.find();
    return carts;
  }

  async addCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    await cartsModel.create({ alias: req.query.alias });
    return res.status(201).json({ message: "Carrito creado con éxito." });
  }

  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let cart = await cartsModel.findById(req.params.cid).populate("products.productId");
    if (cart) {
      return res.status(200).json({ cart });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async getCartView(req, res) {
    let cart = await cartsModel.findById(req.params.cid).populate("products.productId");
    return cart;
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;
    let { qty } = req.body;
    let cart = await cartsModel.findById(cid);
    if (cart) {
      let productIndex = cart.products.findIndex((item) => item.productId == pid);
      if (productIndex !== -1) {
        await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": qty } });
      } else {
        await cartsModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: qty } } });
      }
      return res.status(201).json({ message: "Producto agregado con éxito." });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;
    await cartsModel.updateOne({ _id: cid }, { $pull: { products: { productId: pid } } });
    return res.status(200).json({ message: "Producto eliminado con éxito." });
  }

  async addProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;
    let { products } = req.body;
    let cart = await cartsModel.findById(cid);
    if (cart) {
      for (let i = 0; i < products.length; i++) {
        let { productId: pid, quantity: qty } = products[i];
        let productIndex = cart.products.findIndex((item) => item.productId === pid);
        if (productIndex !== -1) {
          await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": qty } });
        } else {
          await cartsModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: qty } } });
        }
      }
      return res.status(200).json({ message: "Productos añadidos con éxito." });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async deleteProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;
    await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
    return res.status(200).json({ message: "Productos eliminados con éxito." });
  }
}