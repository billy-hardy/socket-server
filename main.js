var Server = require('socket.io');

var app = require('http').createServer(handler);
var io = new Server(app);
var fs = require('fs');
var port = process.env.PORT;

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
        socket.on("user-logged-out", function (user) {
            socket.broadcast.emit("user-logout", user);
            console.log("User, "+(user && user.username)+", logged out");
            delete socketIdUserMap[socket.id];
        });
        socket.on("chat", function(data) {
            console.log(data);
            socket.broadcast.emit("chat", data);
        });
        socket.on("disconnect", function () {
            console.log(socket.id);
            var user = socketIdUserMap[socket.id];
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
