var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var messageRouter = require('./routes/messages.js');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/messages', messageRouter);
app.listen(port);
