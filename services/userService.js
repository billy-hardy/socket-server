var User = require("../beans/user.js");
var DelegateService = require("./delegateService.js");

class UserService extends DelegateService {
    getAllUsers() {
        return this.getAll().then(users => {
            return users.map(user => {
                return User.fromJSON(user);
            });
        });
    }

    getByUsername(username) {
        return this.getByAttr({username});
    }

    addUsers(...users) {
        users = users.filter(user => !user.id && user.username);
        return Promise.all(users.map(user => {
            return this.getByUsername(user.username).then(existingUsers => {
                if(existingUsers.length > 0) {
                    return Promise.reject("User, " + user.username + ", already in use");
                }
                return this.write(user);
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
                return this.write(user);
            });
        }));
    }

    deleteUser(userId) {
        return this.delete(userId);
    }
}

module.exports = UserService;
