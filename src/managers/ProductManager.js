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
    res.setHeader("Content-Type", "application/json");
    let products = await this.getProducts();
    let product = products.find((product) => product.id === req.params.pid);
    if (product) {
      return res.status(200).json({ product });
    } else {
      return res.status(400).json({ error: "Product not found." });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let productExists = products.findIndex((product) => product.code === code) !== -1;
    if (productExists) {
      return res.status(400).json({ error: "Product not added. Error: Code already exists." });
    } else {
      let id = createID();
      let newProduct = new Product(id, title, description, code, price, status, stock, category, thumbnails);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return res.status(201).json({ message: `Product added successfully` });
    }
  }

  async updateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let id = req.params.pid;
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let indexByID = products.findIndex((product) => product.id === id);
    let productExists = indexByID !== -1;
    if (productExists) {
      let indexByCode = products.findIndex((product) => product.code === code);
      let codeExists = indexByCode !== indexByID && indexByCode !== -1;
      if (codeExists) {
        return res.status(400).json({ error: "Invalid code, already exists" });
      } else {
        price = Number(price);
        stock = Number(stock);
        status === "false" && (products[indexByID].status = false);
        status === "true" && (products[indexByID].status = true);
        title && (products[indexByID].title = title);
        description && (products[indexByID].description = description);
        code && (products[indexByID].code = code);
        price && (products[indexByID].price = price);
        stock && (products[indexByID].stock = stock);
        category && (products[indexByID].category = category);
        thumbnails && (products[indexByID].thumbnails = thumbnails);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return res.status(201).json({ message: "Product updated successfully" });
      }
    } else {
      return res.status(400).json({ error: "Product not found" });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let id = await req.params.pid;
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return res.status(201).json({ message: `Product deleted successfully` });
    } else {
      return res.status(400).json({ error: "Product not found." });
    }
  }

  async deleteProductSocket(id) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return {
        success: true,
        message: "Product deleted successfully",
      };
    } else {
      return {
        success: false,
        message: "Product not found",
      };
    }
  }

  async addProductSocket(product) {
    let { title, description, code, price, status, stock, category, thumbnails } = product;
    let products = await this.getProducts();
    let productExists = products.findIndex((product) => product.code === code) !== -1;
    let aFieldIsEmpty = !(title && description && code && price && stock && category);
    if (productExists || aFieldIsEmpty) {
      return {
        success: false,
        message: `Product not added. Errors:${productExists ? " Product already exists." : ""}${
          aFieldIsEmpty ? " Must complete all required fields." : ""
        }`,
      };
    } else {
      price = Number(price);
      stock = Number(stock);
      status === "false" ? (status = false) : (status = true);
      let id = createID();
      let newProduct = new Product(id, title, description, code, price, status, stock, category, thumbnails);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return {
        success: true,
        message: "Product added successfully",
      };
    }
  }
}