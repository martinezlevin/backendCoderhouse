import { messagesService } from "../dao/factory.js";

class MessagesController {
  async getMessages() {
    try {
      let result = await messagesService.get();
      if (result) {
        return result;
      } else {
        return { status: "Error", message: "Error al intentar recibir mensajes" };
      }
    } catch (error) {
      return { status: "Error", message: "Error al intentar recibir mensajes" };
    }
  }

  async sendMessage({ user, message }) {
    try {
      let result = await messagesService.send({ user, message });
      if (result) {
        return { status: "Éxito", message: "Mensaje enviado con éxito" };
      } else {
        return { status: "Error", message: "Error al intentar enviar el mensaje" };
      }
    } catch (error) {
      return { status: "Error", message: "Error al intentar enviar el mensaje" };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;