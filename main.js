var Server = require('socket.io');

var app = require('http').createServer(handler);
var io = new Server(app);
var fs = require('fs');
var port = 8080;
//var port = process.env.PORT;

app.listen(port);
console.log("Deploy port: " + port);

io.on('connection', function (socket) {
    socket.on('publish', function(data) {
        console.log(data);
        socket.broadcast.emit(data);
    });
});

function handler(req, res) {
   fs.readFile(__dirname + '/index.html', 
       function(err, data) {
           if(err) {
               res.writeHead(500);
               return res.end('Error loading index.html');
           }
           res.writeHead(200);
           res.end(data);
       });
}
