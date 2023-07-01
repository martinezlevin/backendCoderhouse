import { productsService } from "../dao/factory.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  handleCaughtError,
} from "../utils/errors.utils.js";

class ProductsController {
  async getProducts(req, res) {
    try {
      let result = await productsService.getPaginated(req.query);
      if (result) {
        return res.status(200).json({ status: "success", result });
      } else {
        throw new ServerError("error trying to get products");
      }
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async getProduct(req, res) {
    try {
      let result = await productsService.getById(req.params.pid);
      if (result) {
        return res.status(200).json({ status: "success", result });
      } else {
        throw new ServerError("error trying to get product");
      }
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async addProduct(req, res) {
    try {
      let codeExists = await productsService.getByCode(req.body.code);
      if (codeExists) throw new BadRequestError("Code already exists");
      if (req.user.role !== "admin") req.body.owner = req.user._id;
      req.body.thumbnails = [req.file.originalname];
      let result = await productsService.create(req.body);
      if (result) {
        return res
          .status(201)
          .json({ status: "success", result: "Product add success" });
      } else {
        throw new ServerError("error trying to add product");
      }
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async updateProduct(req, res) {
    try {
      let product = await productsService.getById(req.params.pid);
      if (product) {
        if (req.user.role !== "admin" && req.user._id !== product.owner)
          throw new ForbiddenError("cannot update not own product");
        if (req.file?.originalname) req.body.thumbnails = req.file.originalname;
        let result = await productsService.updateById(req.params.pid, req.body);
        if (result) {
          return res
            .status(200)
            .json({ status: "success", result: "Product update success" });
        } else {
          throw new ServerError("error trying to update product");
        }
      } else {
        throw new NotFoundError("Product not found");
      }
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async deleteProduct(req, res) {
    try {
      let product = await productsService.getById(req.params.pid);
      if (!product) throw new NotFoundError("product not found");
      if (req.user.role !== "admin" && req.user._id !== product.owner)
        throw new ForbiddenError("cannot delete not own product");
      let result = await productsService.deleteById(req.params.pid);
      if (!result) throw new ServerError("error trying to delete product");
      return res
        .status(200)
        .json({ status: "success", result: `Product delete success` });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }
}

const productsController = new ProductsController();
export default productsController;