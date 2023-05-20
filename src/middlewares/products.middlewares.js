import codeError from "../errors/code.error.js";
import CustomError from "../errors/custom.error.js";
import { productPropertiesErrorInfo } from "../errors/info.error.js";

export const verifyProductProperties = (req, res, next) => {
  let { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (req.method === "POST") {
    let emptyField = !(title && description && code && price && stock && category);
    if (emptyField) {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Propiedades requeridas incompletas.");
    }
  }
  if (title || title === "") {
    let regex = /.+/;
    if (!regex.test(title)) {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de título no válido.");
    }
  }
  if (description || description === "") {
    let regex = /(.|\s)+/;
    if (!regex.test(description)) {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de descripción no válido.");
    }
  }
  if (code || code === "") {
    let regex = /.+/;
    if (!regex.test(code)) {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de código no válido.");
    }
  }
  if (price || price === "") {
    let regex = /^\d+\.?\d{0,2}$/;
    if (regex.test(price)) {
      req.body.price = Number(price);
    } else {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de precio no válido.");
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
        return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de estado no válido.");
      }
    }
  }
  if (stock || stock === "") {
    let regex = /^\d+$/;
    if (regex.test(stock)) {
      req.body.stock = Number(stock);
    } else {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de stock no válido.");
    }
  }
  if (category || category === "") {
    let regex = /.+/;
    if (!regex.test(category)) {
      return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de precio no válido.");
    }
  }
  if (thumbnails) {
    thumbnails.forEach((el) => {
      let regex = /^[\w\.\_\-\/\\]+$/;
      if (!regex.test(el)) {
        return CustomError.customError(codeError.CLIENT_DATA_ERROR, productPropertiesErrorInfo(req.body), "Valor de miniatura no válido.");
      }
    });
  }
  next();
};