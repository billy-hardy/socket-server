var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;

var messageRouter = require('./routes/messages.js');
var usersRouter = require('./routes/users.js');

app.use(bodyParser.json());
app.use('/', express.static('client'));
function auth(req, res, next) {
    console.log("Accessing: "+req.originalUrl+" with method: "+req.method);
    if(req.originalUrl.includes("auth") || req.originalUrl.includes("/users")) {
        next();
        return;
    }
    let webClientToken = req.get("webClientToken");
    userAuthService.isValidSession(webClientToken)
        .then(user => {
            req.currentUser = user;
            console.log("authenticated " + user.username);
            next();
        })
        .catch(e => {
            console.log(e);
            res.end(e);
        });
}

app.use(auth);

app.use('/messages', messageRouter);
app.use('/users', usersRouter);

var server = require('http').Server(app);

var userAuth = require('./userAuth.js');
var userAuthService = userAuth.userAuthService;

var socketIdUserMap = {}; 

var io = require('socket.io')(server);
var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        socket.on("user-login", errorLogger(function (user) {
            for(var id in socketIdUserMap) {
                socket.emit("user-login", socketIdUserMap[id]);
            }
            console.log("User, "+user.username+", logged in");
            socketIdUserMap[socket.id] = user;
            socket.broadcast.emit("user-login", user);
        }));
        socket.on("chat", errorLogger(function(data) {
            console.log(socketIdUserMap[socket.id].username + " sent message " + data.content);
            socket.broadcast.emit("chat", data);
        }));
        socket.on("disconnect", errorLogger(function () {
            if(socketIdUserMap[socket.id]) {
                console.log(socketIdUserMap[socket.id].username + " logged out");
                chat.emit("user-logout", socketIdUserMap[socket.id]);
                delete socketIdUserMap[socket.id];
            }
        }));
    });

function errorLogger(handler) {
    return function() {
        try {
            handler(...arguments);
        } catch(e) {
            console.error(e);
        }
    };
}


server.listen(port);
console.log("Deploying on port " + port);
