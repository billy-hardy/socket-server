var TransientService = require('../../services/transientService.js');
var UserAuth = require('../../services/userAuthService.js');
var userService = new TransientService();
var userAuthService = new UserAuth(userService);

module.exports = {userAuthService,userService};
