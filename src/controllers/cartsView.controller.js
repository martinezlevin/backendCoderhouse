import { cartsDao } from "../dao/factory.js";

class CartsViewController {
  async getCart(cid) {
    try {
      let cart = await cartsDao.getCart(cid);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}

const cartsViewController = new CartsViewController();

export default cartsViewController;