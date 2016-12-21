var User = require("./user.js");
var Service = require("./service.js");
var md5 = require("blueimp-md5");

class UserService extends Service {
    constructor(keypath) {
        super("user", keypath);
    }

    authenticate(username, password) {
        return this.getByUsername(username).then(user => {
            if(user.passwordHash != md5(password)) {
                return Promise.reject("Invalid Username/Password");
            }
            return user;
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
            return filtered[0];
        });
    }

    addUser(user) {
        return this.getByUsername(user.username).then(existingUser => {
            if(existingUser != null) {
                return Promise.reject("Username: "+user.username+" already in use");
            }
            return this.write(user);
        });
    }

    deleteUser(userId) {
        return this.delete(userId);
    }
}

module.exports = UserService;
