var express = require('express');
var router = express.Router();
var UserService = require('../../services/userService.js');
var userAuth = require('../userAuth.js');
var transientService = userAuth.userService;
var userAuthService = userAuth.userAuthService;
var userService = new UserService(transientService);
var url = require('url');

router.route('/')
    .get(function(req, res, next) {
        let queryStrings = Array.from(url.parse(req.originalUrl).query.split('&'));
        let props = {};
        queryStrings.forEach(search => {
            [attr, val] = search.split('=');
            props[attr] = val;
        });
        userService.getByAttr(props)
            .then(users => res.json(users), e => res.send(e));
    })
    .put(function(req, res, next) {
        userService.addUsers(req.body)
            .then(users => res.json(users[0]), error => res.send(error));
    })
    .post(function(req, res, next) {
        userService.addUsers(req.body)
            .then(users => res.json(users[0]), e => res.send(e));
    });

router.param('id', function(req, res, next, id) {
    req.userPromise = userService.getById(id).then(users => users[0]);
    next();
});

router.route('/:id')
    .get(function(req, res, next) {
        req.userPromise
            .then(user => res.json(user), error => res.send(error));
    })
    .delete(function(req, res, next) {
        req.userPromise
            .then(user => {
                return userService.deleteUser(user.id)
                    .then(success => res.json(user), e = Promise.reject(e));
            })
            .catch(error => res.send(error));
    });

router.param('attr', function(req, res, next, attr) {
    req.attr = attr;
    next();
});

router.route('/by/:attr')
    .get(function(req, res, next) {
        userService.getByAttr(req.attr)
            .then(users => res.json(users), e => res.send(e));
    });

router.param('username', function(req, res, next, username) {
    req.username = username;
    req.userPromise = userService.getByUsername(username);
    next();
});

router.param('password', function(req, res, next, passwordHash) {
    req.passwordHash = passwordHash;
    next();
});

router.route('/by-username/:username')
    .get(function(req, res, next) {
        req.userPromise
            .then(users => res.json(users))
            .catch(error => res.send(error));
    });

router.route('/auth/:username/:password')
    .post(function(req, res, next) {
        userAuthService.authenticate(req.username, req.passwordHash)
            .then(credentials => res.json(credentials))
            .catch(e => res.send(e));
    });

module.exports = router;
