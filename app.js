const express = require('express');
const path = require('path');
const session = require('session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config();

const Router = require('/routes/routes');

const app = express();

app.use(compression());
app.use(helmet());

// MongoDB connection

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Conection Error:'));

