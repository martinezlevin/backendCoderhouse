import { productsDao } from "../dao/factory.js";

class ProductsApiController {
  async getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let { category, status, limit, page, sort } = req.query;
      let query = {};
      let options = { limit: 10, page: 1 };

      if (category) {
        query.category = category;
      }
      if (status) {
        query.status = status;
      }
      if (limit) {
        options.limit = limit;
      }
      if (page) {
        options.page = page;
      }
      if (sort) {
        options.sort = { price: sort };
      }

      let products = await productsDao.getProducts(query, options)
      return res.status(200).json({ products });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let product = await productsDao.getProduct(req.params.pid);
      if (product) {
        return res.status(200).json({ product });
      } else {
        return res.status(400).json({ error: "Producto no encontrado." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async addProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsDao.getProductByCode(code);
      if (product) {
        return res.status(400).json({ error: "Producto no añadido. Error: el código ya existe." });
      } else {
        await productsDao.createProduct({
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails,
        });
        return res.status(201).json({ message: `Producto añadido con éxito` });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async updateProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let pid = req.params.pid;
      let product = await productsDao.getProduct(pid);
      if (product) {
        status === false && (await productsDao.updateProduct(pid, "status", status));
        status === true && (await productsDao.updateProduct(pid, "status", status));
        title && (await productsDao.updateProduct(pid, "title", title));
        description && (await productsDao.updateProduct(pid, "description", description));
        code && (await productsDao.updateProduct(pid, "code", code));
        price && (await productsDao.updateProduct(pid, "price", price));
        stock && (await productsDao.updateProduct(pid, "stock", stock));
        category && (await productsDao.updateProduct(pid, "category", category));
        thumbnails && (await productsDao.updateProduct(pid, "thumbnails", thumbnails));
        return res.status(201).json({ message: "Producto actualizado con éxito" });
      } else {
        return res.status(400).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let product = await productsDao.getProduct(req.params.pid);
      if (product) {
        await productsDao.deleteProduct(req.params.pid);
        return res.status(201).json({ message: `Producto eliminado con éxito` });
      } else {
        return res.status(400).json({ error: "Producto no encontrado." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProductSocket(id) {
    try {
      let product = await productsDao.getProduct(req.params.pid);
      if (product) {
        await productsDao.deleteProduct(id);
        return {
          success: true,
          message: "Producto eliminado con éxito",
        };
      } else {
        return {
          success: false,
          message: "Producto no encontrado",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error del Servidor",
      };
    }
  }

  async addProductSocket(product) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = product;
      let productDB = await productsDao.getProductByCode(code);
      if (productDB) {
        return {
          success: false,
          message: `Producto no añadido. errores:${productExists ? " El producto ya existe." : ""}${
            aFieldIsEmpty ? "Debe completar todos los campos requeridos." : ""
          }`,
        };
      } else {
        price = Number(price);
        stock = Number(stock);
        status === "false" ? (status = false) : (status = true);
        await productsDao.createProduct({
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
          message: "Producto añadido con éxito",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error del Servidor",
      };
    }
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;