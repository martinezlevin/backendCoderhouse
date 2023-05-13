import { messagesService } from "../dao/factory.js";

class MessagesController {
  async getMessages() {
    let result = await messagesService.get();
    if (result) {
      return result;
    } else {
      return {
        status: "Error.",
        message: "Algo salió mal, inténtalo de nuevo más tarde.",
      };
    }
  }

  async sendMessage({ user, message }) {
    let result = await messagesService.send({ user, message });
    if (result) {
      return {
        status: "Éxito.",
        message: "Mensaje enviado con éxito.",
      };
    } else {
      return {
        status: "Error.",
        message: "Algo salió mal, inténtalo de nuevo más tarde.",
      };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;