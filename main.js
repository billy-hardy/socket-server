let Rx = require('rx-js');
var ws = require('ws').Server,
    wss = new WebSocketServer({ port: process.env.PORT});
console.log("Deploy port: " + process.env.PORT);

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let json = JSON.parse(message);
        if(json.recipient) {
         // todo: send to recipient
        } else {
        wss.clients.forEach(function(client) {
            if(ws != client) {
                client.send(message);
            }
        });
        }
    });
});
