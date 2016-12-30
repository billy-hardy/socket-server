var Service = require("./service.js");
var Message = require("./message.js");

class MessageService {
    constructor(store, dbPromise, keypath) {
        this.service = new Service(store, dbPromise, keypath)
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
            if(message.id == null) {
                message.id = this.service.generateUUID();
                message.date = new Date().valueOf();
            }
            return this.service.write(message).then(() => {
                return Promise.resolve(message)
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
