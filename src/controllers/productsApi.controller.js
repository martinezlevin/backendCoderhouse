import { productsService } from "../dao/factory.js";
import { BadRequestError, NotFoundError, ServerError, instanceOfCustomError } from "../utils/errors.utils.js";

class ProductsApiController {
  async getProducts(req, res) {
    try {
      let result = await productsService.getPaginated(req.query);
      if (result) {
        return res.status(200).send({ status: "Éxito", result });
      } else {
        throw new ServerError("Error al intentar obtener productos");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "Error", error: error.message })
        : res.status(500).send({ status: "Error", error: "Error del Servidor" });
    }
  }

  async getProduct(req, res) {
    try {
      let result = await productsService.getById(req.params.pid);
      if (result) {
        return res.status(200).send({ status: "Éxito", result });
      } else {
        throw new ServerError("Error al intentar obtener productos");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "Error", error: error.message })
        : res.status(500).send({ status: "Error", error: "Error del Servidor" });
    }
    
  }

  async addProduct(req, res) {
    try {
      let codeExists = await productsService.getByCode(req.body.code);
      if (codeExists) {
        throw new BadRequestError("El código ya existe");
      }
      let result = await productsService.create(req.body);
      if (result) {
        return res.status(201).send({ status: "Éxito", result: "Éxito al agregar el producto" });
      } else {
        throw new ServerError("Error al intentar agregar el producto");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "Error", error: error.message })
        : res.status(500).send({ status: "Error", error: "Error del Servidor" });
    }
  }

  async updateProduct(req, res) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsService.getById(req.params.pid);
      if (product) {
        let update = {};
        status === false && (update.status = status);
        status === true && (update.status = status);
        title && (update.title = title);
        description && (update.description = description);
        code && (update.code = code);
        price && (update.price = price);
        stock && (update.stock = stock);
        category && (update.category = category);
        thumbnails && (update.thumbnails = thumbnails);
        let result = await productsService.updateById(req.params.pid, update);
        if (result) {
          return res.status(200).send({ status: "Éxito", result: "Exito en la actualizacion del producto" });
        } else {
          throw new ServerError("Error al intentar actualizar el producto");
        }
      } else {
        throw new NotFoundError("Producto no encontrado");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "Error", error: error.message })
        : res.status(500).send({ status: "Error", error: "Error del Servidor" });
    }
  }

  async deleteProduct(req, res) {
    try {
      let result = await productsService.deleteById(req.params.pid);
      if (result) {
        return res.status(200).send({ status: "Éxito", result: `Eliminación exitosa del producto` });
      } else {
        throw new ServerError("Error al intentar eliminar el producto");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "Error", error: error.message })
        : res.status(500).send({ status: "Error", error: "Error del Servidor" });
    }
  } 

  async deleteProductSocket(productId, user) {
    try {
      let product = await productsService.getById(productId);
      if (!product) return { success: false, message: "Producto no encontrado" };
      if (user.role === "premium" && user.id !== product.owner)
        return { success: false, message: "El usuario Premium no puede eliminar productos que no son propios" };
      let result = await productsService.deleteById(productId);
      if (result) {
        return {
          success: true,
          message: "Eliminación exitosa del producto",
        };
      } else {
        return {
          success: false,
          message: "Error al intentar eliminar el producto",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error del Servidor",
      };
    }
  }

  async addProductSocket(productData) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails, owner } = productData;
      let emptyField = !(title && description && code && price && stock && category);
      if (emptyField) {
        return {
          success: false,
          message: "Producto no añadido. Error: debe completar todos los campos obligatorios",
        };
      }
      let productExists = await productsService.getByCode(code);
      if (productExists) {
        return {
          success: false,
          message: "Producto no añadido. Error: el producto ya existe",
        };
      }
      price = Number(price);
      stock = Number(stock);
      status === "false" ? (status = false) : (status = true);
      await productsService.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        owner,
      });
      return {
        success: true,
        message: "Éxito en la adición del producto",
      };
    } catch (error) {
      req.logger.debug("Error al intentar agregar el producto");
      return {
        success: false,
        message: "Error del Servidor",
      };
    }
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;