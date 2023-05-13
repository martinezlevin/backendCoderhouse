import { cartsService } from "../dao/factory.js";

class CartsViewController {
  async getCart(cartId) {
    let result = await cartsService.getById(cartId);
    if (result) {
      return result;
    } else {
      return {
        status: "Error",
        error: "Algo salió mal, inténtalo de nuevo más tarde.",
      };
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;