var User = require("./user.js");
var Service = require("./service.js");

class UserService extends Service {
    constructor(store, dbPromise, keypath) {
        super(store, dbPromise, keypath);
    }

    authenticate(username, password) {
        return this.getByUsername(username).then(users => {
            var loggedInUsers = users.filter(function(user) {
                return user.checkPassword(password);
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
        return this.getAll().then(users => {
            return users.map(user => {
                return User.fromJSON(user);
            });
        });
    }

    getByUsername(username) {
        return this.getAllUsers()
            .then(users => users.filter(user => user.username == username));
    }

    addUsers(...users) {
        users = users.filter(user => user.id == null && user.username != null);
        return Promise.all(users.map(user => {
            user.id = this.generateUUID();
            return this.getById(user.id).then(existingUser => {
                if(existingUser != null) {
                    return Promise.reject("User, " + user.id + ", already in use");
                }
                return this.write(user);
            });
        }));
    }

    addExistingUsers(...users) {
        users = users.filter(user => user.id != null && user.username != null);
        return Promise.all(users.map(user => {
            return this.getByUsername(user.username).then(existingUsers => {
                if(existingUsers.length > 0) {
                    return Promise.reject("User, " + user.username + ", already in use");
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
