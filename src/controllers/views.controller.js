import { cartsService, productsService } from "../dao/factory.js";
import { NotFoundError } from "../utils/errors.utils.js";

const getPaginatedProducts = async (query) => {
  let { category, status, limit, sort } = query;
  let params = [];
  if (category) params.push(`category=${category}`);
  if (status) params.push(`status=${status}`);
  if (limit) params.push(`limit=${limit}`);
  if (sort) params.push(`sort=${sort}`);
  let products = await productsService.getPaginated(query);
  if (!products) throw new NotFoundError("Products not found");
  let { prevPage, nextPage, hasPrevPage, hasNextPage } = products;
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
  return { ...products, prevLink, nextLink };
};

class ViewsController {
  async logup(req, res) {
    try {
      if (req.cookies.idToken) return res.redirect("/products");
      res.status(200).render("logup");
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async login(req, res) {
    try {
      if (req.cookies.idToken) return res.redirect("/products");
      res.status(200).render("login");
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async error(req, res) {
    res.status(500).render("error");
  }

  async forgotPassword(req, res) {
    try {
      if (req.cookies.idToken) return res.redirect("/products");
      res
        .status(200)
        .render("forgotPassword");
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async passwordReset(req, res) {
    if (req.cookies.idToken) return res.redirect("/products");
    let { email, token } = req.params;
    res
      .status(200)
      .render("passwordReset", { email, token });
    try {
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async products(req, res) {
    try {
      let paginatedData = await getPaginatedProducts(req.query);
      let products = { ...paginatedData, status: "success" };
      let cart = await cartsService.getById(req.user.cart);
      let user = req.user;
      let isAdmin = user.role === "admin";
      let isPremium = user.role === "premium";
      let isManager = isAdmin || isPremium;
      let possiblePages = [];
      for (let i = 1; i <= products.totalPages; i++) {
        possiblePages.push(i);
      }
      res.render("products", { products, user, isAdmin, isPremium, isManager, possiblePages, cart });
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async cart(req, res) {
    try {
      let cart = await cartsService.getById(req.params.cid);
      if (!cart) throw new NotFoundError("cart not found");
      let user = req.user;
      let isAdmin = user.role === "admin";
      let isPremium = user.role === "premium";
      let isManager = isAdmin || isPremium;
      res.render("cart", { cart, user, isAdmin, isPremium, isManager });
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async realTimeProducts(req, res) {
    try {
      let paginatedData = await getPaginatedProducts(req.query);
      let products = { ...paginatedData, status: "success" };
      res.render("realTimeProducts", {
        products,
        styles: "realTimeProducts.css",
      });
    } catch (error) {
      res.status(500).render("error");
    }
  }

  async chat(req, res) {
    try {
      let user = req.user;
      let messages = await messagesService.get();
      if (!messages) throw new NotFoundError("messages not found");
      res.render("chat", { user, messages, styles: "chat.css" });
    } catch (error) {
      res.status(500).render("error");
    }
  }
}

const viewsController = new ViewsController();
export default viewsController;