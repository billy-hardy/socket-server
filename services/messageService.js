var Message = require('../beans/message.js');
var DelegateService = require('./delegateService');

class MessageService extends DelegateService {
  getAllMessages() {
    return this.getAll().then(messages => {
        return messages.map(message => Message.fromJSON(message));
      }, e => Promise.reject(e));
  }

  getMessages(...ids) {
    return Promise.all(ids.map(id => {
        this.getById(id).then(json => {
            return Message.fromJSON(json);
          });
      }));
  }

  addMessages(...messages) {
    messages = messages.filter(message => {
        return !message.id;
      }).map(message => {
        message.date = new Date().valueOf();
        return message;
      });
    return this.write(...messages);
  }

  deleteMessages(...ids) {
    return Promise.all(ids.map(id => {
        return this.delete(id);
      }));
  }
}

module.exports = MessageService;
