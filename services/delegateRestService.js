var DelegateService = require('./delegateService.js');

class DelegateRestService extends DelegateService {
  get webClientToken() {
    return this.service.webClientToken;
  }

  set webClientToken(token) {
    this.service.webClientToken = token;
  }

  get baseUrl() {
    return this.service.baseUrl;
  }

  set baseUrl(url) {
    this.service.baseUrl = url;
  }

  _constructRequest(url, method, body) {
    return this.service._constructRequest(url, method, body);
  }

  sendRequest(req) {
    return this.service.sendRequest(req);
  }
}

module.exports = DelegateRestService;
