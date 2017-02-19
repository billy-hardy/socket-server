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
                let currentTokens = this.webClientTokenMap.get(user.username) || [];
                currentTokens.push(webClientToken);
                this.webClientTokenMap.set(user.username, currentTokens);
                return {webClientToken, user};
            }
            return Promise.reject("Invalid username/password");
        });
    }
}

module.exports = UserAuthService;
