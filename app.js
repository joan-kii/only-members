const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');

const indexRouter = require('./routes/index');
const User = require('./models/userModel');

require('dotenv').config();

// MongoDB connection

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Conection Error:'));

const port = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(compression());
app.use(helmet());

// Log in

passport.use(
  new LocalStrategy({usernameField: 'userName'}, (username, password, done) => {
    User.findOne({userName: username}, (err, user) => {
      if (err) {return done(err);}
      if(!user) {return done(null, false, {message: 'Incorrect User Name'});}
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {return done(null, false, {message: 'Incorrect Password'});}
        if (res) {return done(null, user);} 
        else {return done(null, false, {message: 'Incorrect Password'})}
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(session({ secret: process.env.SESSION_SECRET || 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false}));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);

// Error

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('index', {message: 'Page not found.'});
});

app.listen(port, () => console.log(`App listeninig on port ${port}!`));
