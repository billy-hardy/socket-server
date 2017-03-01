var moment = require('moment');

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

  toString() {
    return this.user.username + ' (' + moment(this.date).fromNow() + '): ' + this.content;
  }
}

module.exports = Message;
