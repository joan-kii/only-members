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
      .withMessage('Enter your first name.')
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in the first name')
      .escape(),
  body('secondName', 'Second Name Required')
      .trim()
      .isLength({min: 1})
      .withMessage('Enter your second name.')
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in the second name')
      .escape(),
  body('userName', 'User Name Required')
      .trim()
      .isLength({min: 1})
      .withMessage('Enter your username.')
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in username')
      .custom(async (value) => {
        const checkUserName = await User.findOne({ userName: value });
        if (checkUserName) {
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      })
      .withMessage('A user with this username already exists.')
      .escape(),
  body('password', 'Password Required')
      .trim()
      .isLength({min: 4})
      .withMessage('Your password must have at least 4 characters.')
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in the password')
      .escape(),
  body('confirmPassword', 'Confirm Password Required')
      .trim()
      .isLength({min: 4})
      .withMessage('Confirm your password.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        } else {
          return true;
        }
      })
      .escape(),
  body('passcode', 'Enter the admin passcode.')
      .trim()
      .custom((value) => {
        if (value !== '' && value !== process.env.ADMIN_PASSCODE) {
          throw new Error('Admin passcode incorrect');
        } else {
          return true;
        }
      })
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signup-form', { error: errors.array({onlyFirstError: true}) });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          firstName: req.body.firstName,
          secondName: req.body.secondName,
          userName: req.body.userName,
          password: hashedPassword,
          status: false,
          isAdmin: req.body.passcode === process.env.ADMIN_PASSCODE ? true : false
          }).save(err => {
            if (err) res.render('signup-form', {error: err});
            res.redirect('/login');
        });
      })
    }
  }
];

// Log In User

exports.user_login_get = function(req, res, next) {
  res.render('login-form', {error: ''});
};

exports.user_login_post = [
  body('userName', 'Username required.')
      .trim()
      .isLength({min: 1})
      .withMessage('Enter a username.')
      .escape(),
  body('password', 'Password required.')
      .trim()
      .isLength({min: 1})
      .withMessage('Enter a password.')
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', {error: errors.array({onlyFirstError: true})});
    } else {
      next();
    }
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
];

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
  .withMessage('Enter the access key.')
  .isAlphanumeric()
  .withMessage('Enter only alphanumeric characters in the access key.')
  .custom((value) => value === process.env.MEMBERSHIP_KEY)
  .escape(),
  (req, res, next) => {
    let id = mongoose.Types.ObjectId(res.locals.currentUser._id);
    User.findByIdAndUpdate({ _id: id }, { status: true }, function(err, result) {
        if (err) return next(err);
        res.redirect('/');
      }
    )
  }
];
