var Message = require('../beans/message.js');

class MessageService {
    constructor(baseService) {
        this.service = baseService;
    }

    getAllMessages() {
        return this.service.getAll().then(messages => {
            return messages.map(message => Message.fromJSON(message));
        }, e => Promise.reject(e));
    }

    getMessages(...ids) {
        return Promise.all(ids.map(id => {
            this.service.getById(id).then(json => {
                return Message.fromJSON(json);
            });
        }));
    }

    getByAttr(props) {
        return this.service.getByAttr(props);
    }

    addMessages(...messages) {
        messages = messages.filter(message => {
            return !message.id;
        }).map(message => {
            message.date = new Date().valueOf();
            return message;
        });
        return this.service.write(...messages);
    }

    deleteMessages(...ids) {
        return Promise.all(ids.map(id => {
            return this.service.delete(id);
        })); 
    }
}

module.exports = MessageService;
