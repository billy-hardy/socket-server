var TransientService = require("./transientService.js");
var md5 = require("blueimp-md5");
var UUIDUtils = require('../utils/uuidUtils.js');

var SESSION_EXPIRE_TIME = 5*60*1000;

class UserAuthService {
    constructor(service) {
        this.service = service;
        this.webClientTokenMap = new Map();
    }

    authenticate(username, passwordHash) {
        return this.service.getByAttr({username}).then(users => {
            let authenticated = users.filter(user => user.passwordHash === passwordHash);
            if(authenticated.length === 1) {
                let user = authenticated[0];
                let webClientToken = UUIDUtils.generateUUID();
                user.lastActive = new Date().valueOf();
                this.webClientTokenMap.set(webClientToken, user);
                return {webClientToken, user};
            }
            return Promise.reject("Invalid username/password");
        });
    }

    removeSession(webClientToken) {
        return Promise.resolve(this.webClientTokenMap.delete(webClientToken));
    }

    isValidSession(webClientToken) {
        let user = this.webClientTokenMap.get(webClientToken);
        if(!user) {
            return Promise.reject("Invalid webClientToken");
        }
        if(user.lastActive + SESSION_EXPIRE_TIME < new Date().valueOf()) {
            this.removeSession(webClientToken);
            return Promise.reject("WebClientToken expired");
        }
        user.lastActive = new Date().valueOf();
        this.webClientTokenMap.set(webClientToken, user);
        return Promise.resolve(user);
    }
        
}

module.exports = UserAuthService;
