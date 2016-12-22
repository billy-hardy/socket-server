var Server = require('socket.io');

var app = require('http').createServer(handler);
var io = new Server(app);
var fs = require('fs');
var port = process.env.PORT;

app.listen(port);
console.log("Deploying on port " + port);

io.on('connection', function (socket) {
    socket.on("pulse", function(data) {
        console.info("keeping client " + this.id + " alive");
        socket.broadcast.emit("pulse", data);
    });
    socket.on("message", function (data) {
        console.info("Received data, " + data + ", from client, " + this.id);
        console.info("Broadcasting client's, " + this.id + ", message to all connected clients");
        socket.broadcast.send(data);
    });
});

var socketIdUserMap = new Map();

var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        socket.on("user-login", function (user) {
            console.log("User, "+user+", logged in");
            socketIdUserMap.set(socket.id, user);
            socket.broadcast.emit("user-login", user);
        });
        socket.on("chat", function(data) {
            console.log(data);
            socket.broadcast.emit("chat", data);
        });
        socket.on("disconnect", function () {
            var user = socketIdUserMap.get(socket.id);
            socket.broadcast.emit("user-logout", user);
            socketIdUserMap.delete(socket.id);
            console.log("User, "+user+", logged out");
        });
    });

function handler(req, res) {
    var path = '/dist' + req.url;
    if(path.charAt(path.length-1) == '/') {
        path += 'index.html'
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
