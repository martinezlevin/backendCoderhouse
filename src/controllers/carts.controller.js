import { cartsService } from "../dao/factory.js";
import { ServerError, handleCaughtError } from "../utils/errors.utils.js";

class CartsController {
  async getCart(req, res) {
    try {
      let result = await cartsService.getById(req.params.cid);
      if (!result) throw new ServerError("error trying to get cart");
      return res.status(200).json({ status: "success", result });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async addProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let { qty } = req.body;
      let result =
        (await cartsService.updateProductQty(cid, pid, qty)) ||
        (await cartsService.addProduct(cid, pid, qty));
      if (!result) throw new ServerError("error trying to add product");
      return res
        .status(201)
        .json({ status: "success", result: "Product add success" });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async deleteProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let result = await cartsService.deleteProduct(cid, pid);
      if (!result) throw new ServerError("error trying to delete product");
      return res
        .status(200)
        .json({ status: "success", result: "Product delete success" });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async deleteProducts(req, res) {
    try {
      let { cid } = req.params;
      let result = await cartsService.deleteProducts(cid);
      if (!result) throw new ServerError("error trying to delete products");
      return res
        .status(200)
        .json({ status: "success", result: "Products delete success" });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }
}

const cartsController = new CartsController();
export default cartsController;