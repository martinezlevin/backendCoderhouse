import { cartsModel } from "./models/carts.model.js";

export default class CartManagerDB {

  async getCarts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let cart = await cartsModel.findById(req.params.cid);
    if (cart) {
      return res.status(200).json({ cart });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

    async addCart(req, res) {
        let cartToCreate = req.body;

        let newCart = await cartsModel.create(cartToCreate);
        console.log(newCart)
        
        let carts = await cartsModel.find()
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            carts
        })
    }

  async getCartById(req, res) {
    let id = req.params.cid;
    let cartById;
    try {
        cartById = await cartsModel.find({ _id: id })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            mensaje: `El carrito con el id ${id} no fue encontrado.`
        })
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        cartById
    })
}

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let cart = await cartsModel.findById(req.params.cid);
    if (cart) {
      let productIndex = cart.products.findIndex((item) => item.productId === req.params.pid);
      if (productIndex !== -1) {
        await cartsModel.updateOne({ _id: req.params.cid, "products.productId": req.params.pid }, { $inc: { "products.$.quantity": 1 } });
      } else {
        await cartsModel.updateOne({ _id: req.params.cid }, { $push: { products: { productId: req.params.pid } } });
      }
      return res.status(201).json({ message: "Producto agregado con éxito." });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async updateCart(req, res) {
    let id = req.params.cid;
    let cartToUpdate = req.body;
    try {
        let newCart = await cartsModel.updateOne({ _id: id }, cartToUpdate)
        console.log(newCart)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            mensaje: `El carrito con el id ${id} no fue encontrado.`
        })
    }

    let carts = await cartsModel.find()
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
        carts
    })
}

async updateProductFromCart(req, res) {
  let newQuantity = req.body.quantity
  let idCart = req.params.cid
  let idProd = req.params.pid

  let cart = await cartsModel.findById(idCart)
  if (cart) {
      let product = cart.products.find((item) => item.productId == idProd)
      if (product) {
          product.quantity = newQuantity;
          await cartsModel.updateOne({ _id: idCart }, { $set: { products: cart.products } });

          let carts = await cartsModel.find()
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
              carts
          })
      } else {
          res.setHeader("Content-Type", "aplication/json")
          res.status(400).json({
              message: `No existe un producto con Id '${idProd}'`
          })
      }
  } else {
      res.setHeader("Content-Type", "aplication/json")
      res.status(400).json({
          message: `No existe el carrito con Id '${idCart}'`
      })
  }
}

async deleteCart(req, res) {
  let id = req.params.cid;
  let cartToDelete;

  try {
      cartToDelete = await cartsModel.deleteOne({ _id: id });
      console.log('Carrito eliminado: ' + cartToDelete)
  } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
          mensaje: `El carrito con el id ${id} no fue encontrado.`
      })
  }

  let carts = await cartsModel.find()
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
      carts
  })
}

async deleteProductInCart(req, res) {
  let idCart = req.params.cid
  let idProd = req.params.pid

  let cart = await cartsModel.findById(idCart)
  if (cart) {
      let indexProd = cart.products.findIndex((item) => item.productId == idProd)
      if (indexProd !== -1) {
          await cartsModel.deleteOne({ "products.productId": idProd });
          let carts = await cartsModel.find()
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
              carts
          })
      } else {
          res.setHeader("Content-Type", "aplication/json")
          res.status(400).json({
              message: `No existe un producto con Id '${idProd}'`
          })
      }
  } else {
      res.setHeader("Content-Type", "aplication/json")
      res.status(400).json({
          message: `No existe un carrito con Id '${idCart}'`
      })
  }
}

}