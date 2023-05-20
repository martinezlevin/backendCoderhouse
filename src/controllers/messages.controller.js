import { messagesService } from "../dao/factory.js";
import { logger } from "../utils/logger.js";

class MessagesController {
  async getMessages() {
    let result = await messagesService.get();
    if (result) {
      return result;
    } else {
      logger.debug("Error al intentar recibir mensajes.");
      return {
        status: "Error",
        message: "Error al intentar recibir mensajes.",
      };
    }
  }

  async sendMessage({ user, message }) {
    let result = await messagesService.send({ user, message });
    if (result) {
      return {
        status: "Éxito",
        message: "Mensaje enviado con éxito.",
      };
    } else {
      logger.debug("Error al intentar enviar el mensaje.");
      return {
        status: "Error",
        message: "Error al intentar enviar el mensaje.",
      };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;