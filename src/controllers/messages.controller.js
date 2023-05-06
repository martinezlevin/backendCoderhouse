import { messagesDao } from "../dao/factory.js";

class MessagesController {
  async getMessages() {
    try {
      let messages = await messagesDao.getMessages();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async addMessage({ user, message }) {
    try {
      await messagesDao.addMessage({ user, message });
      return {
        status: "Éxito",
        message: "Mensaje agregado exitosamente",
      };
    } catch (error) {
      console.log(error);
      return {
        status: "Error",
      };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;