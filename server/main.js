var Server = require('socket.io');

var app = require('http').createServer(handler);
var io = new Server(app);
var fs = require('fs');
var port = process.env.PORT || 3000;

app.listen(port);
console.log("Deploying on port " + port);

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
            console.log(socketIdUserMap[socket.id] + " logged out");
            chat.emit("user-logout", socketIdUserMap[socket.id]);
            delete socketIdUserMap[socket.id];
        });
    });

function handler(req, res) {
    var path = '/client' + req.url;
    if(path.charAt(path.length-1) === '/') {
        path += 'index.html';
    } 
    var filename = __dirname + path;
    fs.readFile(filename, 
        function(err, data) {
            if(err) {
                console.error('Error loading ' + path + ': ' + err);
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            console.log('Serving: ' + path);
            res.writeHead(200);
            res.end(data);
        });
}
