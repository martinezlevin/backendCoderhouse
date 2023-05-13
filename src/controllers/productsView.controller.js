import { productsService } from "../dao/factory.js";

class ProductsViewController {
  async getProducts(query) {
    let { category, status, limit, sort } = query;
    let params = [];
    if (category) params.push(`category=${category}`);
    if (status) params.push(`status=${status}`);
    if (limit) params.push(`limit=${limit}`);
    if (sort) params.push(`sort=${sort}`);

    let products = await productsService.getPaginated(query);
    if (!products) {
      return {
        status: "Error.",
        error: "Algo salió mal, inténtalo de nuevo más tarde.",
      };
    }
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
    return { status: "Éxito.", payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink };
  }

  async getProduct(productId) {
    try {
      let product = await productsService.getById(productId);
      if (product) {
        return { status: "Éxito.", payload: product };
      } else {
        return { status: "Extraviado." };
      }
    } catch (error) {
      console.log(error);
      return { status: "Error." };
    }
  }
}

const productsViewController = new ProductsViewController();
export default productsViewController;