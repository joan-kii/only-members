const User = require('../models/userModel');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

// Create User

exports.user_create_get = function(req, res, next) {
  res.render('signup-form', {error: ''});
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
  body('passcode')
      .trim()
      .isLength({min: 1})
      .escape(),
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      const errors = validationResult(req);
      if (!errors.isEmpty()) res.render('signup-form', {error: errors.array()})
      const user = new User({
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        userName: req.body.userName,
        password: hashedPassword,
        status: false,
        isAdmin: req.body.passcode === process.env.ADMIN_PASSCODE ? true : false
        }).save(err => {
          if (err) res.render('signup-form', {error: err});
          res.redirect('/');
      });
    })
  }
];

// Log In User

exports.user_login_get = function(req, res, next) {
  res.render('login-form');
};

exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
});

// Log Out User

exports.user_logout_get = function(req, res, next) {
  req.logout();
  res.redirect('/');
};

// Membership

exports.user_membership_get = function(req, res, next) {
  res.render('membership-form');
};

exports.user_membership_post = [
  body('accessKey', 'Access Key required')
  .trim()
  .isLength({min: 1})
  .escape()
  .custom((value, { req }) => value === process.env.MEMBERSHIP_KEY),
  (req, res, next) => {
    let id = mongoose.Types.ObjectId(res.locals.currentUser._id);
    User.findByIdAndUpdate({ _id: id }, { status: true }, function(err, result) {
        if (err) return next(err);
        console.log('LOL')
        res.redirect('/');
      }
    )
  }
];