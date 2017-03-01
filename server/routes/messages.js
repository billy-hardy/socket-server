var express = require('express');
var router = express.Router();
var TransientService = require('../../services/transientService.js');
var MessageService = require('../../services/messageService.js');
var messageService = new MessageService(new TransientService());
var url = require('url');

router.route('/')
    .get(function(req, res, next) {
        let props = {};
        let queryString = url.parse(req.originalUrl).query;
        if (queryString) {
          let queryStrings = Array.from(queryString.split('&'));
          queryStrings.forEach(search => {
              [attr, val] = search.split('=');
              props[attr] = val;
            });
        }
        messageService.getByAttr(props)
            .then(messages => res.json(messages), e => res.send(e));
      })
    .put(function(req, res, next) {
        messageService.addMessages(req.body)
            .then(messages => res.json(messages[0]), error => res.send(error));
      })
    .post(function(req, res, next) {
        messageService.addMessages(req.body)
            .then(messages => res.json(messages[0]), e => res.send(e));
      });

router.param('id', function(req, res, next, id) {
    req.messagePromise = messageService.getMessages(id)
        .then(messages => messages[0], e => Promise.reject(e));
    next();
  });

router.route('/:id')
    .get(function(req, res, next) {
        req.messagePromise
            .then(message => res.json(message), error => res.send(error));
      })
    .delete(function(req, res, next) {
        req.messagePromise
            .then(message => {
                return messageService.delete(message.id)
                    .then(success => res.json(message), e => Promise.reject(e));
              })
            .catch(error => res.send(error));
      });

router.param('attr', function(req, res, next, attr) {
    req.attr = attr;
    next();
  });

router.route('/by/:attr')
    .get(function(req, res, next) {
        messageService.getByAttr(req.attr)
            .then(message => res.json(message), error => res.send(error));
      });

module.exports = router;
