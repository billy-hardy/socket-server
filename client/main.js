var io = require('socket.io-client');

var socket = io("http://localhost:8080");
socket.emit("publish", {my: "data"});
