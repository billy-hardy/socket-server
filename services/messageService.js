var Message = require("../beans/message.js");

class MessageService {
    constructor(baseService) {
        this.service = baseService;
    }

    getAllMessages() {
        return this.service.getAll().then(messages => {
            return messages.map(message => {
                return Message.fromJSON(message);
            });
        });
    }

    getMessages(...ids) {
        return Promise.all(ids.map(id => {
            this.service.getById(id).then(json => {
                return Message.fromJSON(json);
            });
        }));
    }

    addMessages(...messages) {
        return Promise.all(messages.map(message => {
            if(!message.id) {
                message.id = this.service.generateUUID();
                message.date = new Date().valueOf();
            }
            return this.service.write(message).then(() => {
                return Promise.resolve(message);
            }, e => {
                return Promise.reject(e);
            });
        }));
    }

    deleteMessages(...ids) {
        return Promise.all(ids.map(id => {
            return this.service.delete(id);
        })); 
    }
}

module.exports = MessageService;
