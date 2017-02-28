const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var UserService = require("../../services/userService.js");
var MessageService = require("../../services/messageService.js");
var RestService = require("../../services/nodeRestService.js");
var UserRestService = require("../../services/userRestService.js");

var messageRestService = new RestService(BASE_URL+"/messages");
var messageService = new MessageService(messageRestService);
var userRestService = new UserRestService(new RestService(BASE_URL+"/users"));
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
                options();
            });
    });
});

function options() {
    console.log("S: send a message");
    console.log("G: get all messages");
    console.log("E: exit");
    rl.question("Select a command: ", command => {
        if(command === "S" || command === "s") {
            chat();
        }
        else if(command === "G" || command === "g") {
            getMessages();
        }
        else if(command === "E" || command === "e") {
            process.exit();
        }
        else {
            options();
        }
    });
}

function getMessages() {
    messageService.getAllMessages()
        .then(messages => {
            messages.forEach(message => {
                console.log(message.toString());
            });
            options();
        })
        .catch(options);
}

function sendMessage(content) {
    let message = new Message(user, content);
    messageService.addMessages(message)
        .then(messages => {
            console.log("success");
            options();
        }, e => {
            console.error(e);
            options();
        });
}

function chat() {
    rl.question("Input: ", sendMessage);
}
