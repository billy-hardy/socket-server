const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var UserService = require("../../services/userService.js");
var MessageService = require("../../services/messageService.js");
var RestService = require("../../services/nodeRestService.js");
var UserRestService = require("../../services/userRestService.js");

var messageRestService = new RestService("http://localhost:5000/messages");
var messageService = new MessageService(messageRestService);
var userRestService = new UserRestService(new RestService("http://localhost:5000/users"));
var userService = new UserService(userRestService);
var user;

var User = require("../../beans/user.js");
var Message = require("../../beans/message.js");

rl.question("Username: ", (username) => {
    rl.question("Password: ", (password) => {
        userService.authenticate(username, password)
            .then(r => {
                user = r.user;
                console.log(JSON.stringify(user));
                userRestService.webClientToken = r.webClientToken;
                messageRestService.webClientToken = r.webClientToken;
                chat();
            });
    });
});

function sendMessage(content) {
    let message = new Message(user, content);
    messageService.addMessages(message)
        .then(messages => {
            console.log("success");
        }, e => {
            console.error(e);
        });
}


function chat() {
    rl.question("Input: ", sendMessage);
}
