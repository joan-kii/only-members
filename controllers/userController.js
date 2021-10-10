const User = require('../models/userModel');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.user_create_get = function(req, res, next) {
  res.render('signup-form');
};

exports.user_create_post = [
  body('firstName', 'First Name Required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('secondName', 'Second Name Required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('userName', 'User Name Required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('password', 'Password Required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('confirmPassword', 'Confirm Password Required')
      .trim()
      .isLength({min: 1})
      .escape()
      .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      const errors = validationResult(req);
      const user = new User({
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        userName: req.body.userName,
        password: hashedPassword,
        status: false
        }).save(err => {
          if (err) return next(err);
          res.redirect('/');
      });
    })
  }
];
