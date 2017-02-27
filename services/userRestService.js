var DelegateRestService = require('./delegateRestService.js');
var md5 = require("blueimp-md5");

class UserRestService extends DelegateRestService {
    authenticate(username, password) {
        let req = this._constructRequest(this.baseUrl+'/auth/'+username+'/'+md5(password), 'post');
        return this.sendRequest(req);
    }
}

module.exports = UserRestService;
