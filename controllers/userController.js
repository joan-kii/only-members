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
      .escape()
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in username')
      .custom((value) => {
        User.findOne({ userName: value }, function(err, user) {
          if (err) throw new Error(err);
          if (user) {
            throw new Error('There is a user with this username.');
          } else {
            return true;
          }
        })
      }),
  body('password', 'Password Required')
      .trim()
      .isLength({min: 4})
      .withMessage('Enter your password, at least 4 characters.')
      .escape()
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in the password'),
  body('confirmPassword', 'Confirm Password Required')
      .trim()
      .isLength({min: 4})
      .withMessage('Confirm your password.')
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        } else {
          return true;
        }
      }),
  body('passcode')
      .trim()
      .withMessage('Enter the admin passcode.')
      .escape()
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters in the passcode.')
      .custom((value) => {
        if (value !== '' && value !== process.env.ADMIN_PASSCODE) {
          throw new Error('Admin passcode incorrect');
        } else {
          return true;
        }
      }),
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
            res.redirect('login-form');
        });
      })
    }
  }
];

// Log In User

exports.user_login_get = function(req, res, next) {
  res.render('login-form');
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

      // Seguir aqui
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  });
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
  .escape()
  .isAlphanumeric()
  .withMessage('Enter only alphanumeric characters in the access key.')
  .custom((value) => value === process.env.MEMBERSHIP_KEY),
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
