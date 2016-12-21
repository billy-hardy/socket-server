var io = require('socket.io-client');
var Handlebars = require("handlebars");

var socket = io(window.location.origin);
setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);
setInterval(function () {
    socket.send("hello");
}, 1000);

Handlebars.registerPartial('chatMessage',
    '<li>{{this}}</li>');


socket.on("message", function(data) {
    var threadSource = document.getElementById("chatThread").innerHTML;
    var threadTemplate = Handlebars.compile(threadSource);
    console.info(data);
    var html = threadTemplate({messages: [data]});
    document.body.innerHTML += html;
});
