import { productsService } from "../dao/factory.js";
import { createFakeProduct } from "../utils/utils.js";

class ProductsApiController {
  async getProducts(req, res) {
    let result = await productsService.getPaginated(req.query);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result });
    } else {
      req.logger.debug("Error al intentar obtener productos.");
      return res.status(500).send({ status: "Error.", error: "Error al intentar obtener productos." });
    }
  }

  async getProduct(req, res) {
    let result = await productsService.getById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result });
    } else {
      req.logger.debug("Error al intentar obtener productos.");
      return res.status(500).send({ status: "Error.", error: "Error al intentar obtener productos." });
    }
  }

  async addProduct(req, res) {
    let codeExists = await productsService.getByCode(req.body.code);
    if (codeExists) {
      req.logger.debug("Producto no añadido. El código ya existe.");
      return res.status(400).send({ status: "Error.", error: "Producto no añadido. El código ya existe." });
    }
    let result = await productsService.create(req.body);
    if (result) {
      return res.status(201).send({ status: "Éxito.", result: "Producto agregado con éxito." });
    } else {
      req.logger.debug("Error al intentar agregar el producto.");
      return res.status(500).send({ status: "Error.", error: "Error al intentar agregar el producto." });
    }
  }

  async updateProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let productExists = await productsService.getById(req.params.pid);
    if (productExists) {
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
        return res.status(200).send({ status: "Éxito.", result: "Producto actualizado con éxito." });
      } else {
        req.logger.debug("Error al intentar actualizar el producto.");
        return res.status(500).send({ status: "Error.", error: "Error al intentar actualizar el producto." });
      }
    } else {
      req.logger.debug("Producto no encontrado.");
      return res.status(400).send({ status: "Error.", error: "Producto no encontrado." });
    }
  }

  async deleteProduct(req, res) {
    let result = await productsService.deleteById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result: `Producto eliminado con éxito.` });
    } else {
      req.logger.debug("Error al intentar eliminar el producto.");
      return res.status(500).send({ status: "Error.", error: "Error al intentar eliminar el producto." });
    }
  }

  async deleteProductSocket(productId) {
    try {
      let product = await productsService.deleteById(productId);
      if (product) {
        return {
          success: true,
          message: "Producto eliminado con éxito.",
        };
      } else {
        return {
          success: false,
          message: "Producto no encontrado.",
        };
      }
    } catch (error) {
      req.logger.debug("Error al intentar eliminar el producto.");
      return {
        success: false,
        message: "Error del Servidor.",
      };
    }
  }

  async addProductSocket(productData) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = productData;
      let emptyField = !(title && description && code && price && stock && category);
      if (emptyField) {
        return {
          success: false,
          message: "Producto no añadido. Error: debe completar todos los campos obligatorios.",
        };
      }
      let productExists = await productsService.getByCode(code);
      if (productExists) {
        return {
          success: false,
          message: "Producto no añadido. Error: El producto ya existe.",
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
      });
      return {
        success: true,
        message: "Producto agregado con éxito.",
      };
    } catch (error) {
      req.logger.debug("Error al intentar agregar el producto.");
      return {
        success: false,
        message: "Error del Servidor.",
      };
    }
  }

  async getMockingProducts(req, res) {
    let products = [];
    let limit = req.query.qty || 100;

    for (let i = 0; i < limit; i++) {
      products.push(createFakeProduct());
    }

    return res.status(200).send({ status: "Éxito.", products });
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;