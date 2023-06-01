import { cartsService, productsService, ticketsService, usersService } from "../dao/factory.js";

class CartsApiController {
  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let result = await cartsService.getById(req.params.cid);
    if (result) {
      return res.status(200).json({ status: "Éxito", result });
    } else {
      req.logger.debug("Error al intentar obtener el carrito");
      return res.status(500).json({ status: "Error", error: "Error al intentar obtener el carrito" });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;
    let { qty } = req.body;
    let result = (await cartsService.updateProductQty(cid, pid, qty)) || (await cartsService.addProduct(cid, pid, qty));
    if (result) {
      return res.status(201).json({ status: "Éxito", result: "Producto añadido con éxito" });
    } else {
      req.logger.debug("Error al intentar agregar el producto");
      return res.status(500).json({ status: "error", error: "Error al intentar agregar el producto" });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;
    let result = await cartsService.deleteProduct(cid, pid);
    if (result) {
      return res.status(200).json({ status: "Éxito", result: "Producto eliminado con éxito" });
    } else {
      req.logger.debug("Error al intentar eliminar el producto");
      return res.status(500).json({ status: "Error", error: "Error al intentar eliminar el producto" });
    }
  }

  async deleteProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;
    let result = await cartsService.deleteProducts(cid);
    if (result) {
      return res.status(200).json({ status: "Éxito", result: "Productos eliminados con éxito" });
    } else {
      req.logger.debug("Error al intentar eliminar productos");
      return res.status(500).json({ status: "Error", error: "Error al intentar eliminar productos" });
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
      return res.status(200).json({ status: "Agotado", outOfStock });
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
      return res.status(201).json({ status: "Éxito", result: "Productos eliminados con éxito" });
    } else {
      req.logger.debug("Error al intentar enviar el pedido");
      return res.status(500).json({ status: "Error", error: "Error al intentar enviar el pedido" });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;