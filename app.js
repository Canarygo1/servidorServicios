  var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var exjwt =require('express-jwt');
var config = require('./config/config');
var socketio = require("socket.io");
var io = socketio();

var indexRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var app = express();
app.io = io;
// socket.io events

const jwtMW = exjwt({
   secret:config.secret
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/' ,indexRouter);
app.use('/servicios', usersRouter);
var routes = require('./routes/location')(io);
module.exports = app;
