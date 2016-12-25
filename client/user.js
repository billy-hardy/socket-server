var md5 = require("blueimp-md5");

class User {
    static fromJSON(user) {
        var newUser = new User(user.username);
        newUser.passwordHash = user.passwordHash;
        newUser.id = user.id;
        return newUser;
    }

    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.id = null;
    }

    set password(password) {
        this.passwordHash = md5(password);
    }

    checkPassword(password) {
        return this.passwordHash == md5(password);
    }
}

module.exports = User;
