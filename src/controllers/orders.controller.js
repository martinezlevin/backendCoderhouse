import {
    cartsService,
    productsService,
    ordersService,
  } from "../dao/factory.js";
  import {
    ForbiddenError,
    ServerError,
    handleCaughtError,
  } from "../utils/errors.utils.js";
  import { createCode } from "../utils/utils.js";
  
  class OrdersController {
    async sendOrder(req, res) {
      try {
        let cart = await cartsService.getById(req.params.cid);
        let outOfStock = [];
        cart.products.forEach(async (cartProduct) => {
          let dbProduct = await productsService.getById(cartProduct.product._id);
          if (cartProduct.qty > dbProduct.stock) {
            outOfStock.push(cartProduct.product._id);
          }
        });
        if (outOfStock.length)
          return res
            .status(200)
            .json({ status: "out of stock", result: outOfStock });
        let orderCode = createCode();
        let order = {
          code: `${req.user.email}-${orderCode}`,
          amount: cart.amount,
          purchaser: req.user.email,
          products: cart.products,
          status: "sent",
        };
        cart.products.forEach(async (cartProduct) => {
          await productsService.updateStockById(
            cartProduct.product._id,
            cartProduct.quantity * -1
          );
        });
        let result = await ordersService.create(order);
        if (!result) throw new ServerError("error trying to send order");
        await cartsService.deleteProducts(cart._id);
        return res.status(201).json({ status: "success", result: orderCode });
      } catch (error) {
        handleCaughtError(res, error);
      }
    }
  
    async getOrder(req, res) {
      try {
        let orderCode = `${req.user.email}-${req.params.oc}`;
        let result = await ordersService.getByCode(orderCode);
        if (!result) throw new ServerError("error trying to get order");
        return res.status(200).json({ status: "success", result });
      } catch (error) {
        handleCaughtError(res, error);
      }
    }
  
    async getOrders(req, res) {
      try {
        let result = await ordersService.get(req.body);
        if (!result) throw new ServerError("error trying to get orders");
        return res.status(200).json({ status: "success", result });
      } catch (error) {
        handleCaughtError(res, error);
      }
    }
  
    async updateOrder(req, res) {
      try {
        if (req.user.role !== "admin")
          throw new ForbiddenError("only admin user can update orders");
        let result = await ordersService.updateByCode(req.params.oc, req.body);
        if (!result) throw new ServerError("error trying to update order");
        return res
          .status(200)
          .json({ status: "success", result: "order update success" });
      } catch (error) {
        handleCaughtError(res, error);
      }
    }
  }
  
  const ordersController = new OrdersController();
  export default ordersController;