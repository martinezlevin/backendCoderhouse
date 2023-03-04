export const addProductMid = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category } = req.body;
    let aFieldIsEmpty = !(title && description && code && price && stock && category);
    if (aFieldIsEmpty) {
      return res.status(400).json({ error: "Producto no añadido. Error: debe completar todos los campos obligatorios" });
    }
    req.body.price = Number(price);
    req.body.stock = Number(stock);
    let invalidStatus = !["false", "true", "", undefined].includes(status);
    console.log(invalidStatus);
    if (isNaN(req.body.price) || isNaN(req.body.stock) || invalidStatus) {
      return res.status(400).json({ error: "Producto no añadido. Valores no válidos" });
    }
    status === "false" ? (req.body.status = false) : (req.body.status = true);
    next();
  }