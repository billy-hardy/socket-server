var io = require('socket.io-client');

var socket = io(window.origin);
setInterval(function () {
    socket.emit("pulse");
}, 10000);
socket.on("publish", function(data) {
    console.info(data);
});
