var Server = require('socket.io');

//var io = new Server(process.env.PORT);
//console.log("Deploy port: " + process.env.PORT);
var io = new Server(8080);
console.log("Deploy port: " + 8080);

io.on('connection', function (socket) {
    socket.on('publish', function(data) {
        console.log(data);
        socket.broadcast.emit(data);
    });
});
