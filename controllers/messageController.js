const Message = require('../models/messageModel');

const { body, validationResult } = require('express-validator');

exports.message_create_get = function(req, res, next) {
  res.render('message-form');
};

exports.message_create_post = [
    body('title', 'Title Required')
        .trim()
        .isLength({min: 1})
        .withMessage('Enter the title.')
        .escape(),
    body('mesage', 'Message Required')
        .trim()
        .isLength({min: 1})
        .withMessage('Enter the message.')
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const message = new Message({
        title: req.body.title,
        message: req.body.message,
        created: Date.now(),
        author: res.locals.currentUser.userName
      }).save(err => {
        if (err) return next(err);
        res.redirect('/');
    });
  }
];

exports.message_delete_post = function(req, res, next) {
  Message.findByIdAndRemove(req.body.messageId, function(err, message) {
    if (err) return next(err);
    res.redirect('/');
  })
};
