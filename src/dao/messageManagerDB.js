import messagesModel from './models/messages.models.js';

class messageManagerDB {
    async addMessage(message, req, res) {
        let messageToCreate = message;
        await messagesModel.create(messageToCreate);

    }
}

export default messageManagerDB;