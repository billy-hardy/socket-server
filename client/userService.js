var User = require("./user.js");
var Service = require("./service.js");
var md5 = require("blueimp-md5");

class UserService extends Service {
    constructor(keypath) {
        super("user", keypath);
    }

    authenticate(username, password) {
        return this.getByUsername(username).then(users => {
            var loggedInUsers = users.filter(function(user) {
                return user.passwordHash == md5(password);
            });
            if(loggedInUsers.length > 0) {
                return loggedInUsers[0];
            }
            return Promise.reject("Invalid Username/Password");
        }, () => {
            return Promise.reject("Invalid Username/Password");
        });
    }

    getAllUsers() {
        return this.getAll();
    }

    getByUsername(username) {
        return this.getAll().then(users => {
            let filtered = users.filter(user => user.username == username);
            return filtered;
        });
    }

    addUser(...users) {
        return Promise.all(users.map(user => {
            this.getById(user.id).then(existingUser => {
                if(existingUser != null) {
                    return Promise.reject("User, "+user.id+", already in use");
                }
                return this.write(user);
            });
        }));
    }

    deleteUser(userId) {
        return this.delete(userId);
    }
}

module.exports = UserService;
