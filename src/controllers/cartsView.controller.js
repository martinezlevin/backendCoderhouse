import { cartsService } from "../dao/factory.js";

class CartsViewController {
  async getCart(cartId) {
    try {
      let result = await cartsService.getById(cartId);
      if (result) {
        return result;
      } else {
        return { status: "Error", error: "Error al intentar obtener el carrito" };
      }
    } catch (error) {
      return { status: "Error", error: "Error al intentar obtener el carrito" };
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;