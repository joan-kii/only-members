const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const indexRouter = require('./routes/index');

require('dotenv').config();

const app = express();

app.use(compression());
app.use(helmet());

// MongoDB connection

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Conection Error:'));

app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false}));

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

app.listen(3000, () => console.log('App listeninig on port 3000!'));
