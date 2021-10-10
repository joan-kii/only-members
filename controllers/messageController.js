const Message = require('../models/messageModel');

const { body, validationResult } = require('express-validator');

exports.message_create_get = function(req, res, next) {
  res.render('message-form');
};

exports.user_create_post = [
    body('title', 'Title Required')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('mesage', 'Message Required')
        .trim()
        .isLength({min: 1})
        .escape(),
    (req, res, next) => {
      if (err) return next(err);
      const errors = validationResult(req);
      const message = new Message({
        title: req.body.title,
        message: req.body.message,
        created: Date.now(),
        author: false
      }).save(err => {
        if (err) return next(err);
        res.redirect('/');
    });
  }
];