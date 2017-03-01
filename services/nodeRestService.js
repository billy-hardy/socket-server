var fetch = require('node-fetch');
var RestService = require('./restService.js');

class NodeRestService extends RestService {
  sendRequest({url, config}) {
    return fetch(url, config).then(res => res.json());
  }
}

module.exports = NodeRestService;
