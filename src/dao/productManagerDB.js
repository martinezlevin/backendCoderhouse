import { productsModel } from "./models/products.model.js";

export default class productManagerDB {
  async getProducts(limit) {
    let products = await productsModel.find().limit(limit);
    return products;
  }

  async getProductById(req, res) {
    res.setHeader("Content-Type", "application/json");
    let product = await productsModel.find({ _id: req.params.pid });
    if (product.length) {
      return res.status(200).json({ product });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product = await productsModel.find({ code: code });
    if (product.length) {
      return res.status(400).json({ error: "Producto no añadido. Error: el código ya existe." });
    } else {
      await productsModel.create({
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnails: thumbnails,
      });
      return res.status(201).json({ message: `Producto agregado con éxito.` });
    }
  }

  async updateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product = await productsModel.find({_id: req.params.pid});
    if (product.length) {
      status === false && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { status: false } }));
      status === true && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { status: true } }));
      title && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { title: title } }));
      description && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { description: description } }));
      code && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { code: code } }));
      price && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { price: price } }));
      stock && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { stock: stock } }));
      category && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { category: category } }));
      thumbnails && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { thumbnails: thumbnails } }));
      return res.status(201).json({ message: "Producto actualizado con éxito." });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let product = await productsModel.find({ _id: req.params.pid });
    if (product.length) {
      await productsModel.deleteOne({ _id: req.params.pid });
      return res.status(201).json({ message: "Producto eliminado con éxito." });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }
}
