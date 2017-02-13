var express = require('express');
var router = express.Router();
var TransientService = require('../../services/transientService.js');
var UserService = require('../../services/userService.js');
var userService = new UserService(new TransientService());

router.route('/')
    .get(function(req, res, next) {
        userService.getAllUsers()
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

router.param('username', function(req, res, next, username) {
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
            .then(users => res.json(users), error => res.send(error));
    });

router.route('/auth/:username/:password')
    .post(function(req, res, next) {
        req.userPromise
            .then(user => {
                if(user && user.passwordHash === req.passwordHash) {
                    return user;
                }
                return Promise.reject("Invalid Username/Password");
            }, _ => Promise.reject("Invalid Username/Password"))
            .then(user => res.json(user), e => res.send(e));
    });

module.exports = router;
