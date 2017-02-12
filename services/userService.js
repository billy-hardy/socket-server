var User = require("../beans/user.js");

class UserService {
    constructor(baseService) {
        this.service = baseService;
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
        return this.service.getAll().then(users => {
            return users.map(user => {
                return User.fromJSON(user);
            });
        });
    }

    getByUsername(username) {
        return this.getAllUsers()
            .then(users => users.filter(user => user.username === username));
    }

    addUsers(...users) {
        users = users.filter(user => !user.id && user.username);
        return Promise.all(users.map(user => {
            user.id = this.service.generateUUID();
            return this.service.getById(user.id).then(existingUser => {
                if(existingUser) {
                    return Promise.reject("User, " + user.id + ", already in use");
                }
                return this.service.write(user);
            });
        }));
    }

    addExistingUsers(...users) {
        users = users.filter(user => user.id && !user.username);
        return Promise.all(users.map(user => {
            return this.getByUsername(user.username).then(existingUsers => {
                if(existingUsers.length > 0) {
                    return Promise.reject("User, " + user.username + ", already in use");
                }
                return this.service.write(user);
            });
        }));
    }

    deleteUser(userId) {
        return this.service.delete(userId);
    }
}

module.exports = UserService;
