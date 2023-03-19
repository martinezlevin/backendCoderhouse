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
  constructor(archivo) {
      this.path = archivo;
      this.getCarts = this.getCarts.bind(this);
      this.addCart = this.addCart.bind(this);
      this.getCartById = this.getCartById.bind(this);
      this.addProductToCart = this.addProductToCart.bind(this);
      this.deleteCart = this.deleteCart.bind(this);
  }

  async getCarts(req, res) {
      if (existsSync(this.path)) {
          let cartsTxt = await promises.readFile(this.path, "utf-8");
          let carts = JSON.parse(cartsTxt);
          res.setHeader("Content-Type", "aplication/json")
          res.status(200).json({
              carts
          })
      } else {
          res.setHeader("Content-Type", "aplication/json")
          res.status(400).json({ message: "No existe el archivo ${this.path}'" })
          return []
      }
  }

  async addCart(req, res) {
      if (existsSync(this.path)) {
          let cartsTxt = await promises.readFile(this.path, "utf-8");
          let carts = JSON.parse(cartsTxt);

          let newCart = {
              id: uuidv4(),
              products: []
          }
          carts.push(newCart)
          await promises.writeFile(this.path, JSON.stringify(carts, null, 3))
          res.setHeader("Content-Type", "aplication/json")
          res.status(201).json({
              carts
          })
      } else {
          console.error("Not Found 2")
          res.setHeader('Content-Type', 'application/json');
          return res.status(500).json({
            message: "Carrito no encontrado."
          })
      }
  }

  async getCartById(req, res) {
      if (existsSync(this.path)) {
          let id = req.params.cid

          let cartsTxt = await promises.readFile(this.path, "utf-8");
          let carts = JSON.parse(cartsTxt);

          const cartById = carts.find(element => element.id == id);
          if (cartById) {
              res.setHeader("Content-Type", "aplication/json")
              res.status(200).json({
                  cartById
              })
          } else {
              console.error("Not Found 1")
              res.setHeader("Content-Type", "aplication/json")
              res.status(400).json({ message: "No existe el carrito con id'${req.params.cid}'"})
          }
      } else {
          console.error("Not Found 2")
          res.setHeader('Content-Type', 'application/json');
          return res.status(500).json({ message: "Carrito no encontrado."})
      }
  }

  async addProductToCart(req, res) {
      if (existsSync(this.path)) {
          let idCart = req.params.cid
          let idProd = req.params.pid

          let cartsTxt = await promises.readFile(this.path, "utf-8");
          let carts = JSON.parse(cartsTxt);

          const newProduct = {
              id: idProd,
              quantity: 1
          }

          let indexCart = await carts.findIndex(element => element.id == idCart)
          if (indexCart !== -1) {
              let indexProd = await carts[indexCart].products.findIndex(element => element.id == idProd)
              if (indexProd === -1) {
                  await carts[indexCart].products.push(newProduct)
                  await promises.writeFile(this.path, JSON.stringify(carts, null, 3))
                  res.setHeader("Content-Type", "aplication/json")
                  res.status(201).json({
                      carts
                  })
              } else {
                  carts[indexCart].products[indexProd].quantity++
                  await promises.writeFile(this.path, JSON.stringify(carts, null, 3))
                  res.setHeader("Content-Type", "aplication/json")
                  res.status(201).json({
                      carts
                  })
              }
          } else {
              res.setHeader("Content-Type", "aplication/json")
              res.status(400).json({ message: "No existe el carrito con Id '${idCart}'"})
          }
      } else {
          console.error("Not Found 2")
          res.setHeader('Content-Type', 'application/json');
          return res.status(500).json({ message: "Carrito no encontrado."})
      }
  }

  async deleteCart(req, res) {
      if (existsSync(this.path)) {
          let id = req.params.cid
          let cartsTxt = await promises.readFile(this.path, "utf-8");
          let carts = JSON.parse(cartsTxt);

          const position = carts.findIndex(element => element.id == id);

          if (position != -1) {
              let cartsFiltrados = carts.filter(element => element.id != id)
              console.log(`Se ha eliminado el carrito con Id '${id}'`)
              carts = cartsFiltrados
              await promises.writeFile(this.path, JSON.stringify(carts, null, 3))
              res.setHeader("Content-Type", "aplication/json")
              res.status(200).json({
                  carts
              })
          } else {
              res.setHeader("Content-Type", "aplication/json")
              await res.status(400).json({
                  message: "No existe el carrito con Id '${id}'."
              })
          }
      } else {
          console.error("Not Found 2")
          res.setHeader('Content-Type', 'application/json');
          return res.status(500).json({
            message: "Carrito no encontrado."
          })
      }
  }
}