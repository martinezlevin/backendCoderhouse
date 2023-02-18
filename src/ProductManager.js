import fs from "fs";
import { v4 as createID } from "uuid";

class Product {
  constructor(id, title, description, code, price, status = true, stock, category, thumbnails) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts(limit) {
    let fileExists = fs.existsSync(this.path);
    if (fileExists) {
      let data = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(data);
      return products.slice(0, limit);
    } else {
      return [];
    }
  }

  async getProductById(req, res) {
    let products = await this.getProducts();
    let product = products.find((product) => product.id === req.params.pid);
    res.setHeader("Content-Type", "application/json");
    if (product) {
      res.status(200).json({ product });
    } else {
      res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async addProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let productExists = products.findIndex((product) => product.code === code) !== -1;
    let aFieldIsEmpty = !(title && description && code && price && stock && category);
    res.setHeader("Content-Type", "application/json");
    if (productExists || aFieldIsEmpty) {
      res.status(400).json({ error: `Product not added. Errors:${productExists ? "El producto ya existe." : ""}${aFieldIsEmpty ? "Debe completar todos los campos requeridos." : ""}` });
    } else {
      price = Number(price);
      stock = Number(stock);
      status === "false" && (status = false);
      status === "true" && (status = true);
      let id = createID();
      let newProduct = new Product(id, title, description, code, price, status, stock, category, thumbnails);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      res.status(201).json({ message: `Producto añadido con éxito` });
    }
  }

  async updateProduct(req, res) {
    let id = req.params.pid;
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let index = products.findIndex((product) => product.id === id);
    let productExists = index !== -1;
    res.setHeader("Content-Type", "application/json");
    if (productExists) {
      price = Number(price);
      stock = Number(stock);
      if (status === "false") {
        products[index].status = false;
      }
      if (status === "true") {
        products[index].status = true;
      }
      title && (products[index].title = title);
      description && (products[index].description = description);
      code && (products[index].code = code);
      price && (products[index].price = price);
      stock && (products[index].stock = stock);
      category && (products[index].category = category);
      thumbnails && (products[index].thumbnails = thumbnails);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      res.status(201).json({ message: `Producto actualizado con éxito` });
    } else {
      res.status(400).json({ error: "Producto no encontrado." });
    }

  }

  async deleteProduct(req, res) {
    let id = await req.params.pid;
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    res.setHeader("Content-Type", "application/json");
    if (productExists) {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      res.status(201).json({ message: `Producto eliminado con éxito` });
    } else {
      res.status(400).json({ error: "Producto no encontrado." });
    }
  }
}
