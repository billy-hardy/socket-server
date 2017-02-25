var fetch = require('node-fetch');
var DelegateRestService = require('./delegateRestService.js');
var RestService = require('./restService.js');

class NodeRestService extends DelegateRestService {
    constructor(baseUrl) {
        super();
        this.service = new RestService(baseUrl, fetch);
    }
}

module.exports = NodeRestService;
