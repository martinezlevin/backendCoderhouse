import { cartsService, productsService, ticketsService, usersService } from "../dao/factory.js";

class CartsApiController {
  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let result = await cartsService.getById(req.params.cid);
    if (result) {
      return res.status(200).json({ status: "success", result });
    } else {
      req.logger.debug("error trying to get cart");
      return res.status(500).json({ status: "error", error: "error trying to get cart" });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;
    let { qty } = req.body;
    let result = (await cartsService.updateProductQty(cid, pid, qty)) || (await cartsService.addProduct(cid, pid, qty));
    if (result) {
      return res.status(201).json({ status: "success", result: "Product added successfully" });
    } else {
      req.logger.debug("error trying to add product");
      return res.status(500).json({ status: "error", error: "error trying to add product" });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;
    let result = await cartsService.deleteProduct(cid, pid);
    if (result) {
      return res.status(200).json({ status: "success", result: "Product deleted successfully" });
    } else {
      req.logger.debug("error trying to delete product");
      return res.status(500).json({ status: "error", error: "error trying to delete product" });
    }
  }

  async deleteProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;
    let result = await cartsService.deleteProducts(cid);
    if (result) {
      return res.status(200).json({ status: "success", result: "Products deleted successfully" });
    } else {
      req.logger.debug("error trying to delete products");
      return res.status(500).json({ status: "error", error: "error trying to delete products" });
    }
  }

  async sendOrder(req, res) {
    res.setHeader("Content-Type", "application/json");
    let cart = await cartsService.getById(req.params.cid);
    let outOfStock = [];
    cart.products.forEach(async (cartProduct) => {
      let dbProduct = await productsService.getById(cartProduct.productId._id);
      if (cartProduct.qty > dbProduct.stock) {
        outOfStock.push(cartProduct.productId._id);
      }
    });
    if (outOfStock.length) {
      return res.status(200).json({ status: "out of stock", outOfStock });
    }
    let nextOrder = req.body.lastOrder + 1;
    let order = {
      code: `${req.body.email}-${nextOrder}`,
      amount: cart.amount,
      purchaser: req.body.email,
      products: cart.products,
    };
    cart.products.forEach(async function (cartProduct) {
      await productsService.updateStockById(cartProduct.productId._id, cartProduct.quantity * -1);
    });
    let result = await ticketsService.send(order);
    if (result) {
      await usersService.updateByEmail(req.body.email, { lastOrder: nextOrder });
      await cartsService.deleteProducts(cart._id);
      return res.status(201).json({ status: "success", result: "Products deleted successfully" });
    } else {
      req.logger.debug("error trying to send order");
      return res.status(500).json({ status: "error", error: "error trying to send order" });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;