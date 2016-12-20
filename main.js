var Server = require('socket.io');

var app = require('http').createServer(handler);
var io = new Server(app);
var fs = require('fs');
var port = process.env.PORT;

app.listen(port);
console.log("Deploying on port " + port);

io.on('connection', function (socket) {
    socket.on("pulse", function() {
        console.info("keeping client " + this.id + " alive");
    });
    socket.on('publish', function(data) {
        console.log(data);
        socket.broadcast.emit('publish', data);
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
