class Message {
    constructor(user, content) {
        this.user = user;
        this.content = content;
        this.id = null;
        this.date = null;
    }
    
    static fromJSON(message) {
        var m = new Message(message.user, message.content);
        m.id = message.id;
        m.date = message.date;
        return m;
    }
}

module.exports = Message;
