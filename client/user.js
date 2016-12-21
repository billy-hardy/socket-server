var md5 = require("blueimp-md5");

class User {
    constructor(username, password) {
        this.username = username;
        this.passwordHash = md5(password);
        this.id = getUUID();
    }
}

function getUUID() {
    function r4() {
        function r() {
            return Math.floor(Math.random()*10)+'';
        }
        return r()+r()+r()+r();
    }
    return r4()+r4()+r4()+r4();
}

module.exports = User;
