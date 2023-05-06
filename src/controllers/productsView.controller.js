import { productsDao } from "../dao/factory.js";

class ProductsViewController {
  async getProducts(reqQuery) {
    try {
      let { category, status, limit, page: queryPage, sort } = reqQuery;
      let query = {};
      let options = { limit: 10, page: 1 };
      let params = [];

      if (category) {
        query.category = category;
        params.push(`category=${category}`);
      }
      if (status) {
        query.status = status;
        params.push(`status=${status}`);
      }
      if (limit) {
        options.limit = limit;
        params.push(`limit=${limit}`);
      }
      if (queryPage) {
        options.page = queryPage;
      }
      if (sort) {
        options.sort = { price: sort };
        params.push(`sort=${sort}`);
      }

      let products = await productsDao.getProducts(query, options);
      let { docs, totalPages, page, prevPage, nextPage, hasPrevPage, hasNextPage } = products;
      let prevLink;
      let nextLink;
      if (hasPrevPage) {
        prevLink = `/products/?page=${prevPage}`;
        if (params.length) {
          for (let i = 0; i < params.length; i++) {
            prevLink += `&${params[i]}`;
          }
        }
      } else {
        prevLink = null;
      }
      if (hasNextPage) {
        nextLink = `/products/?page=${nextPage}`;
        if (params.length) {
          for (let i = 0; i < params.length; i++) {
            nextLink += `&${params[i]}`;
          }
        }
      } else {
        nextLink = null;
      }
      return { status: "éxito", payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink };
    } catch (error) {
      console.log(error);
      return { status: "error" };
    }
  }

  async getProduct(pid) {
    try {
      let product = await productsDao.getProduct(pid);
      if (product) {
        return { status: "éxito", payload: product };
      } else {
        return { status: "no encontrado" };
      }
    } catch (error) {
      console.log(error);
      return { status: "error" };
    }
  }
}

const productsViewController = new ProductsViewController();
export default productsViewController;