var io = require('socket.io-client');
var Handlebars = require("handlebars");

var socket = io(window.location.origin);
var chat = io(window.location.origin + "/chat");

setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);

Handlebars.registerPartial('chatMessage', '<li>{{this.user.username}}: {{this.content}}</li>');
Handlebars.registerPartial('userItem', '<li>{{this.username}}</li>');

window.publishMessage = function publishMessage(content) {
    var message = new Message(window.loggedInUser, content);
    messageService.addMessages(message).then(messages => {
        messages.forEach(message => {
            chat.emit("chat", message);
            addMessage(message);
        });
    }, e => console.error("Failed to save message: " + e ));
};

window.allUsers = new Map();

chat.on("user-login", addExistingUser);
chat.on("user-logout", removeUser); 
chat.on("chat", addMessage);
chat.on("disconnect", function () {
    chat.emit("user-logout", window.loggedInUser);
});

function addExistingUser(user) {
    userService.addExistingUsers(user).then(function () {
        console.log("User, "+user.username+", successfully added");
    }, function(e) {
        console.log(e);
    });
    window.allUsers.set(user.id, user);
    updateUserList();
}

function removeUser(user) {
    window.allUsers.delete(user.id);
    updateUserList();
}

function addMessage(message) {
    window.messages.push(message);
    window.messages.sort(function sort(a, b) {
        return a.date - b.date;
    });
    updateMessageList();
}

function updateUserList() {
    var userListSource = document.getElementById("userList").innerHTML;
    var userListTemplate = Handlebars.compile(userListSource);
    var html = userListTemplate(Array.from(window.allUsers.values()));
    var div = document.getElementById("users");
    div.innerHTML = html;
}

function updateMessageList() {
    var threadSource = document.getElementById("chatThread").innerHTML;
    var threadTemplate = Handlebars.compile(threadSource);
    var html = threadTemplate({messages: window.messages});
    var div = document.getElementById("messages");
    div.innerHTML = html;
}

var UserService = require("./userService.js");
var User = require("./user.js");
var userService = new UserService();
window.userService = userService;

var MessageService = require("./messageService.js");
var Message = require("./message.js");
var messageService = new MessageService();
window.messageService = messageService;
window.messages = [];

window.authenticate = function authenticate(username, password) {
    var loggedIn = userService.authenticate(username, password);
    loggedIn.then(user => {
        chat.emit("user-login", user);
        updateUserList();
        messageService.getAllMessages().then(messages => {
            messages.forEach(message => {
                addMessage(message);
            });
        });
    });
    return loggedIn;
};

window.addUser = function addUser(username, password) {
    var user = new User(username, password);
    return userService.addUsers(user);
};
