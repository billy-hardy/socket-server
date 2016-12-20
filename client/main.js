var io = require('socket.io-client');

var socket = io(window.location.origin);
setInterval(function () {
    socket.emit("pulse", socket.id);
}, 30000);
setInterval(function () {
    socket.send("hello");
}, 1000);

socket.on("message", function(data) {
    console.info(data);
});
