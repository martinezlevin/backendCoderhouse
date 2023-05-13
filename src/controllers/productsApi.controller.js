import { productsService } from "../dao/factory.js";

class ProductsApiController {
  async getProducts(req, res) {
    let result = await productsService.getPaginated(req.query);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result });
    } else {
      return res.status(500).send({ status: "Error.", error: "Algo salió mal, inténtalo de nuevo más tarde." });
    }
  }

  async getProduct(req, res) {
    let result = await productsService.getById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result });
    } else {
      return res.status(500).send({ status: "Error.", error: "Algo salió mal, inténtalo de nuevo más tarde." });
    }
  }

  async addProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product = await productsService.getByCode(code);
    if (product) {
      return res.status(400).send({ status: "Error.", error: "Producto no añadido. El código ya existe." });
    }
    let result = await productsService.create({
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    });
    if (result) {
      return res.status(201).send({ status: "Éxito.", result: "Producto agregado con éxito." });
    } else {
      return res.status(500).send({ status: "Error.", error: "Algo salió mal, inténtalo de nuevo más tarde." });
    }
  }

  async updateProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let pid = req.params.pid;
    let product = await productsService.getById(pid);
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
      let result = await productsService.updateById(pid, update);
      if (result) {
        return res.status(200).send({ status: "Éxito.", result: "Producto actualizado con éxito." });
      } else {
        return res.status(500).send({ status: "Error.", error: "Algo salió mal, inténtalo de nuevo más tarde." });
      }
    } else {
      return res.status(400).send({ status: "Error.", error: "Producto no encontrado." });
    }
  }

  async deleteProduct(req, res) {
    let result = await productsService.deleteById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "Éxito.", result: `Producto eliminado con éxito.` });
    } else {
      return res.status(500).send({ status: "Error.", error: "Algo salió mal, inténtalo de nuevo más tarde." });
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
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnails: thumbnails,
      });
      return {
        success: true,
        message: "Producto agregado con éxito.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error del Servidor.",
      };
    }
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;