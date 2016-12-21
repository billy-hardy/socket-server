var io = require('socket.io-client');
var Handlebars = require("handlebars");

var socket = io(window.location.origin);
var chat = io(window.location.origin + "/chat");

setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);

Handlebars.registerPartial('chatMessage', '<li>{{this.name}}: {{this.content}}</li>');

window.publishMessage = function publishMessage(content) {
    var message = {
        name: window.loggedInUser.username, 
        content: content
    };

    chat.emit("chat", message);
    addMessage(message);
};

chat.on("chat", addMessage);

function addMessage(message) {
    var threadSource = document.getElementById("chatThread").innerHTML;
    var threadTemplate = Handlebars.compile(threadSource);
    console.info(message);
    var html = threadTemplate({messages: [message]});
    document.getElementById("messages").innerHTML += html;
}

var UserService = require("./userService.js");
var User = require("./user.js");
var userService = new UserService();
window.userService = userService;

window.authenticate = function authenticate(username, password) {
    return userService.authenticate(username, password);
};

window.addUser = function addUser(username, password) {
    var user = new User(username, password);
    return userService.addUser(user);
};
