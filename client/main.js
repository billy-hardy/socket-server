var io = require('socket.io-client');
var Handlebars = require("handlebars");

var socket = io(window.location.origin);
var chat = io(window.location.origin + "/chat");

setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);

Handlebars.registerPartial('chatMessage', '<li>{{this.name}}: {{this.content}}</li>');

window.publishMessage = function publishMessage(name, content) {
    chat.emit("chat", {name, content});
    addMessage({name, content});
};

chat.on("chat", addMessage);

function addMessage(message) {
    var threadSource = document.getElementById("chatThread").innerHTML;
    var threadTemplate = Handlebars.compile(threadSource);
    console.info(message);
    var html = threadTemplate({messages: [message]});
    document.getElementById("messages").innerHTML += html;
}
