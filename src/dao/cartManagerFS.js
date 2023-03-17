import fs from "fs";
import { v4 as createID } from "uuid";

class Cart {
  constructor(id, alias, products = []) {
    this.id = id;
    this.alias = alias;
    this.products = products;
  }
}

class CartItem {
  constructor(productID, quantity = 1) {
    this.product = productID;
    this.quantity = quantity;
  }
}

export default class CartManagerFS {
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
    res.setHeader("Content-Type", "application/json");
    let carts = await this.getCarts();
    let newCart = new Cart(createID(), req.query.alias);
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return res.status(201).json({ message: "Carrito creado con éxito." });
  }

  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let carts = await this.getCarts();
    let cart = carts.find((cart) => cart.id === req.params.cid);
    if (cart) {
      return res.status(200).json({ cart });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let carts = await this.getCarts();
    let cartIndex = carts.findIndex((cart) => cart.id === req.params.cid);
    let cartExists = cartIndex !== -1;
    if (cartExists) {
      let prodIndex = carts[cartIndex].products.findIndex((item) => item.product === req.params.pid);
      let prodExists = prodIndex !== -1;
      if (prodExists) {
        carts[cartIndex].products[prodIndex].quantity++;
      } else {
        let cartItem = new CartItem(req.params.pid);
        carts[cartIndex].products.push(cartItem);
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return res.status(201).json({ message: "Producto agregado con éxito." });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }
}