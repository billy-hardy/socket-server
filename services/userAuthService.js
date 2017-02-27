var TransientService = require("./transientService.js");
var md5 = require("blueimp-md5");
var UUIDUtils = require('../utils/uuidUtils.js');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

var SESSION_EXPIRE_TIME = 5*60*1000;

class UserAuthService {
    constructor(service) {
        this.service = service;
    }

    authenticate(username, passwordHash) {
        return this.service.getByAttr({username}).then(users => {
            let authenticated = users.filter(user => user.passwordHash === passwordHash);
            if(authenticated.length === 1) {
                let user = authenticated[0];
                let webClientToken = jwt.sign(user.id, config.secret);
                return {webClientToken, user};
            }
            return Promise.reject("Invalid username/password");
        });
    }

    isValidSession(webClientToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(webClientToken, config.secret, (err, decoded) => {
                if (err) {
                    reject({success: false, message: "Invalid webClientToken"});
                }
                else {
                    resolve(this.service.getById(decoded));
                }
            });
        });
    }

}

module.exports = UserAuthService;
