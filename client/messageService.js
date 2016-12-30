var Service = require("./service.js");
var Message = require("./message.js");

class MessageService extends Service {
    constructor(store, dbPromise, keypath) {
        super(store, dbPromise, keypath)
    }

    getAllMessages() {
        return this.getAll().then(messages => {
            return messages.map(message => {
                return Message.fromJSON(message);
            });
        });
    }

    getMessages(...ids) {
        return Promise.all(ids.map(id => {
            return Message.fromJSON(this.getById(id));
        }));
    }

    addMessages(...messages) {
        return Promise.all(messages.map(message => {
            if(message.id == null) {
                message.id = this.generateUUID();
                message.date = new Date().valueOf();
            }
            return this.write(message).then(() => {
                return Promise.resolve(message)
            }, e => {
                return Promise.reject(e);
            });
        }));
    }

    deleteMessages(...ids) {
        return Promise.all(ids.map(id => {
            return this.delete(id);
        })); 
    }
}

module.exports = MessageService;
