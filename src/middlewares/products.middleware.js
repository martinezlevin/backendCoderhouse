import { BadRequestError, instanceOfCustomError } from "../utils/errors.utils.js";

export const verifyProductProperties = (req, res, next) => {
  try {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (req.method === "POST") {
      let emptyField = !(title && description && code && price && stock && category);
      if (emptyField) {
        throw new BadRequestError("Propiedades requeridas incompletas");
      }
    }
    if (title || title === "") {
      let regex = /.+/;
      if (!regex.test(title)) {
        throw new BadRequestError("Valor de título no válido");
      }
    }
    if (description || description === "") {
      let regex = /(.|\s)+/;
      if (!regex.test(description)) {
        throw new BadRequestError("Valor de descripción no válido");
      }
    }
    if (code || code === "") {
      let regex = /.+/;
      if (!regex.test(code)) {
        throw new BadRequestError("Valor de código no válido");
      }
    }
    if (price || price === "") {
      let regex = /^\d+\.?\d{0,2}$/;
      if (regex.test(price)) {
        req.body.price = Number(price);
      } else {
        throw new BadRequestError("Valor de precio no válido");
      }
    }
    if (status === "false" || status === false) {
      req.body.status = false;
    } else {
      if (status === "true" || status === true) {
        req.body.status = true;
      } else {
        if (!status) {
          if (req.method === "POST") req.body.status = true;
        } else {
          throw new BadRequestError("Valor de estado no válido");
        }
      }
    }
    if (stock || stock === "") {
      let regex = /^\d+$/;
      if (regex.test(stock)) {
        req.body.stock = Number(stock);
      } else {
        throw new BadRequestError("Valor de stock no válido");
      }
    }
    if (category || category === "") {
      let regex = /.+/;
      if (!regex.test(category)) {
        throw new BadRequestError("Valor de precio no válido");
      }
    }
    if (thumbnails) {
      thumbnails.forEach((el) => {
        let regex = /^[\w\.\_\-\/\\]+$/;
        if (!regex.test(el)) {
          throw new BadRequestError("Valor de miniatura no válido");
        }
      });
    }
    next();
  } catch (error) {
    return instanceOfCustomError(error)
      ? res.status(error.code).send({ status: "Error", error: error.message })
      : res.status(500).send({ status: "Error", error: "Error del servidor" });
  }
};