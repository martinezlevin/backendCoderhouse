import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import CartManagerFS from "../dao/cartManagerFS.js";
import cartManagerDB from "../dao/cartManagerDB.js";
import path from "path";

const router = Router();
const cm = new CartManagerFS(path.join(__dirname, "../files/carts.json"));
const cart = new cartManagerDB

router.get('/', cart.getCarts)

router.get("/:cid", cart.getCartById)

router.post("/", cart.addCart)

router.post("/:cid/products/:pid", cart.addProductToCart)

router.put('/:cid', cart.updateCart)

router.put('/:cid/products/:pid', cart.updateProductFromCart)

router.delete("/:cid", cart.deleteCart)

router.delete("/:cid/products/:pid", cart.deleteProductInCart)

export default router;