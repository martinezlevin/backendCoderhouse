import fs from "fs";
import { v4 as createID } from "uuid";

class Cart {
  constructor(id, alias, products = []) {
    this.id = id;
    this.alias = alias;
    this.products = products;
  }
}

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    let fileExists = fs.existsSync(this.path);
    if (fileExists) {
      let data = await fs.promises.readFile(this.path, "utf-8");
      let carts = JSON.parse(data);
      return carts;
    } else {
      return [];
    }
  }

  async addCart(req, res) {
    let carts = await this.getCarts();
    let newCart = new Cart(createID(), req.query.alias);
    ///Aclaración: Pense en agregarle un alias para identificar al cart de forma personalizada.
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ message: `Cart created successfully` });
  }

  async getCart(req, res) {
    let carts = await this.getCarts();
    let cart = carts.find((cart) => cart.id === req.params.cid);
    res.setHeader("Content-Type", "application/json");
    if (cart) {
      res.status(200).json({ cart });
    } else {
      res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async addProduct(req, res) {
    let carts = await this.getCarts();
    let cartIndex = carts.findIndex(cart => cart.id === req.params.cid);
    let cartExists = cartIndex !== -1;
    res.setHeader("Content-Type", "application/json");
    if (cartExists) {
      let prodIndex = carts[cartIndex].products.findIndex(item => item.product === req.params.pid);
      console.log(prodIndex);
      let prodExists = prodIndex !== -1;
      if (prodExists) {
        carts[cartIndex].products[prodIndex].quantity++
      } else {
        carts[cartIndex].products.push({product: req.params.pid, quantity: 1})
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      res.status(201).json({ message: `Producto añadido con éxito` });
    } else {
      res.status(400).json({ error: "Carrito no encontrado." });
    }
  }
}