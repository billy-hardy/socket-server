var io = require('socket.io-client');
var Handlebars = require("handlebars");

var socket = io(window.location.origin);
var chat = io(window.location.origin + "/chat");

setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);

Handlebars.registerPartial('chatMessage', '<li>{{this.name}}: {{this.content}}</li>');
Handlebars.registerPartial('userItem', '<li>{{this.username}}</li>');

window.publishMessage = function publishMessage(content) {
    var message = {
        name: window.loggedInUser.username, 
        content: content
    };

    chat.emit("chat", message);
    addMessage(message);
};

window.allUsers = new Map();

chat.on("user-login", addUser);
chat.on("user-logout", removeUser); 
chat.on("chat", addMessage);
chat.on("disconnect", function () {
    chat.emit("user-logout", window.loggedInUser);
});

function addUser(user) {
    userService.addUser(user);
    window.allUsers.set(user.id, user);
    updateUserList();
}

function removeUser(user) {
    window.allUsers.delete(user.id);
    updateUserList();
}

function updateUserList() {
    var userListSource = document.getElementById("userList").innerHTML;
    var userListTemplate = Handlebars.compile(userListSource);
    var html = userListTemplate(Array.from(window.allUsers.values()));
    var div = document.getElementById("users");
    div.innerHTML = html;
}

function addMessage(message) {
    var threadSource = document.getElementById("chatThread").innerHTML;
    var threadTemplate = Handlebars.compile(threadSource);
    console.info(message);
    var html = threadTemplate({messages: [message]});
    var div = document.getElementById("messages");
    div.innerHTML = html + div.innerHTML;
}

var UserService = require("./userService.js");
var User = require("./user.js");
var userService = new UserService();
window.userService = userService;

window.authenticate = function authenticate(username, password) {
    var loggedIn = userService.authenticate(username, password);
    loggedIn.then(user => {
        chat.emit("user-login", user);
        updateUserList();
    });
    return loggedIn;
};

window.addUser = function addUser(username, password) {
    var user = new User(username, password);
    return userService.addUser(user);
};
