import { productsModel } from "./models/products.model.js";

export default class productManagerDB {
  async getProducts(req) {
    let { category, status, limit, page, sort } = req.query;
    let query = {};
    let options = {limit: 10, page: 1};
    let params = [];
    let response = {};
    if (category) {
      (query.category = category);
      params.push(`category=${category}`);
    };
    if (status) {
      (query.status = status)
      params.push(`status=${status}`);
    };
    if (limit) {
      (options.limit = limit)
      params.push(`limit=${limit}`);
    };
    if (page) {
      (options.page = page);
    };
    if (sort) {
      (options.sort = { price: sort })
      params.push(`sort=${sort}`);
    };
    try {
      let products = await productsModel.paginate(query, options);
      let { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products;
      response.status = "success";
      response.payload = docs;
      response.totalPages = totalPages;
      response.prevPage = prevPage;
      response.nextPage = nextPage;
      response.page = page;
      response.hasPrevPage = hasPrevPage;
      response.hasNextPage = hasNextPage;
      if (hasPrevPage) {
        response.prevLink = `/products/?page=${prevPage}`
        if (params.length) {
        for (let i = 0; i < params.length; i++) {
            response.prevLink += `&${params[i]}`
          }
        }
      } else {
        response.prevLink = null;
      }
      if (hasNextPage) {
        response.nextLink = `/products/?page=${nextPage}`
        if (params.length) {
        for (let i = 0; i < params.length; i++) {
            response.nextLink += `&${params[i]}`
          }
        }
      } else {
        response.nextLink = null;
      }
      return response;
    } catch (error) {
      response.status = "error";
      return response;
    }
  }

  async getProductById(req, res) {
    res.setHeader("Content-Type", "application/json");
    let product = await productsModel.find({ _id: req.params.pid });
    if (product.length) {
      return res.status(200).json({ product });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product = await productsModel.find({ code: code });
    if (product.length) {
      return res.status(400).json({ error: "Producto no añadido. Error: el código ya existe." });
    } else {
      await productsModel.create({
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnails: thumbnails,
      });
      return res.status(201).json({ message: "Producto añadido correctamente."});
    }
  }

  async updateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product = await productsModel.find({ _id: req.params.pid });
    if (product.length) {
      status === false && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { status: false } }));
      status === true && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { status: true } }));
      title && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { title: title } }));
      description && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { description: description } }));
      code && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { code: code } }));
      price && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { price: price } }));
      stock && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { stock: stock } }));
      category && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { category: category } }));
      thumbnails && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { thumbnails: thumbnails } }));
      return res.status(201).json({ message: "Producto actualizado con éxito." });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let product = await productsModel.find({ _id: req.params.pid });
    if (product.length) {
      await productsModel.deleteOne({ _id: req.params.pid });
      return res.status(201).json({ message: "Producto eliminado con éxito." });
    } else {
      return res.status(400).json({ error: "Producto no encontrado." });
    }
  }

  async deleteProductSocket(id) {
    let product = await productsModel.find({ _id: id });
    if (product.length) {
      await productsModel.deleteOne({ _id: id });
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
  }

  async addProductSocket(product) {
    let { title, description, code, price, status, stock, category, thumbnails } = product;
    let productDB = await productsModel.find({ code: code });
    if (productDB.length) {
      return {
        success: false,
        message: `Producto no añadido. Errores: ${productExists ? "El producto ya existe." : ""}${
          aFieldIsEmpty ? "Debe completar todos los campos requeridos." : ""
        }`,
      };
    } else {
      price = Number(price);
      stock = Number(stock);
      status === "false" ? (status = false) : (status = true);
      await productsModel.create({
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
    }
  }
}
