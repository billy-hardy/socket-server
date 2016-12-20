var io = require('socket.io-client');

var socket = io(window.location.origin);
setInterval(function () {
    socket.emit("pulse");
}, 10000);
socket.on("publish", function(data) {
    console.info(data);
});
