var Service = require("./services.js");
var Message = require("./message.js");

class MessageService extends Service {
    constructor(keypath) {
        super("message", keypath)
    }

    addMessages(...message) {

    }

}

module.exports = MessageService;
