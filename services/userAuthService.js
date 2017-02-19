var TransientService = require("./transientService.js");
var md5 = require("blueimp-md5");
var UUIDUtils = require('../utils/uuidUtils.js');

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
        return Promise.resolve(user);
    }
        
}

module.exports = UserAuthService;
