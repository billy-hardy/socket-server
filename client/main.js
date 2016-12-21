var io = require('socket.io-client');
var Handlebars = require("handlebars");

var socket = io(window.location.origin);
setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);

Handlebars.registerPartial('chatMessage',
    '<li>{{this}}</li>');

window.publishMessage = function publishMessage(message) {
    socket.send(message);
};

socket.on("message", function(data) {
    var threadSource = document.getElementById("chatThread").innerHTML;
    var threadTemplate = Handlebars.compile(threadSource);
    console.info(data);
    var html = threadTemplate({messages: [data]});
    document.getElementById("messages").innerHTML += html;
});
