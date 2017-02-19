var User = require("../beans/user.js");

class UserService {
    constructor(baseService) {
        this.service = baseService;
    }

    authenticate(username, password) {
        return this.service.authenticate(username, password);
    }

    getAllUsers() {
        return this.service.getAll().then(users => {
            return users.map(user => {
                return User.fromJSON(user);
            });
        });
    }

    getById(id) {
        return this.service.getById(id);
    }

    getByUsername(username) {
        return this.service.getByAttr({username});
    }

    addUsers(...users) {
        users = users.filter(user => !user.id && user.username);
        return Promise.all(users.map(user => {
            return this.getByUsername(user.username).then(existingUsers => {
                if(existingUsers.length > 0) {
                    return Promise.reject("User, " + user.username + ", already in use");
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
