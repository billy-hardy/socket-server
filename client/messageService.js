var Service = require("./service.js");
var Message = require("./message.js");

class MessageService extends Service {
    constructor(keypath) {
        super("message", keypath)
    }

    addMessages(...messages) {
        return Promise.all(messages.map(message => {
            message.id = this.generateUUID();
            message.date = new Date().valueOf();
            return this.write(message).then(() => {
                return Promise.resolve(message)
            }, e => {
                return Promise.reject(e);
            });
        }));
    }
}

module.exports = MessageService;
