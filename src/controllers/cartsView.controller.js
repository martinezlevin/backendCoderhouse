import { cartsService } from "../dao/factory.js";
import { logger } from "../utils/logger.js";

class CartsViewController {
  async getCart(cartId) {
    let result = await cartsService.getById(cartId);
    if (result) {
      return result;
    } else {
      logger.debug("Error al intentar obtener el carrito.");
      return {
        status: "Error",
        error: "Error al intentar obtener el carrito.",
      };
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;