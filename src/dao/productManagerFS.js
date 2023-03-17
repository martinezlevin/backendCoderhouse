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

export default class ProductManagerFS {
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
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async addProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let productExists = products.findIndex((product) => product.code === code) !== -1;
    if (productExists) {
      return res.status(400).json({ error: "Producto no añadido. Error: el código ya existe." });
    } else {
      let id = createID();
      let newProduct = new Product(id, title, description, code, price, status, stock, category, thumbnails);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return res.status(201).json({ message: "Producto agregado con éxito." });
    }
  }

  async updateProduct(req, res) {
    let id = req.params.pid;
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let indexByID = products.findIndex((product) => product.id === id);
    let productExists = indexByID !== -1;
    if (productExists) {
      let indexByCode = products.findIndex((product) => product.code === code);
      let codeExists = indexByCode !== indexByID && indexByCode !== -1;
      if (codeExists) {
        return res.status(400).json({ error: "Código no válido, ya existe." });
      } else {
        status === false && (products[indexByID].status = false);
        status === true && (products[indexByID].status = true);
        title && (products[indexByID].title = title);
        description && (products[indexByID].description = description);
        code && (products[indexByID].code = code);
        price && (products[indexByID].price = price);
        stock && (products[indexByID].stock = stock);
        category && (products[indexByID].category = category);
        thumbnails && (products[indexByID].thumbnails = thumbnails);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return res.status(201).json({ message: "Producto actualizado con éxito." });
      }
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
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
      return res.status(201).json({ message: "Producto eliminado con éxito." });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
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
        message: "Producto eliminado con éxito.",
      };
    } else {
      return {
        success: false,
        message: "Producto no encontrado.",
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
        message: `Producto no añadido. Errores:${productExists ? "El producto ya existe." : ""}${
          aFieldIsEmpty ? "Debe completar todos los campos requeridos." : ""
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
        message: "Producto agregado con éxito.",
      };
    }
  }
}