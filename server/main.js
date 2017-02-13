var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');

var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var messageRouter = require('./routes/messages.js');

var socketIdUserMap = {}; 

var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        socket.on("user-login", function (user) {
            for(var id in socketIdUserMap) {
                socket.emit("user-login", socketIdUserMap[id]);
            }
            console.log("User, "+user.username+", logged in");
            socketIdUserMap[socket.id] = user;
            socket.broadcast.emit("user-login", user);
        });
        socket.on("chat", function(data) {
            console.log(socketIdUserMap[socket.id].username + " sent message " + data.content);
            socket.broadcast.emit("chat", data);
        });
        socket.on("disconnect", function () {
            if(socketIdUserMap[socket.id]) {
                console.log(socketIdUserMap[socket.id].username + " logged out");
                chat.emit("user-logout", socketIdUserMap[socket.id]);
                delete socketIdUserMap[socket.id];
            }
        });
    });

app.use(bodyParser.json());
app.use('/', express.static('client'));
app.use('/messages', messageRouter);

server.listen(port);
console.log("Deploying on port " + port);
