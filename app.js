var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config/config');

var indexRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var location = require('./routes/location');
var app = express();
var io = require('./socket.io');
var server = app.listen(3000);

io.startIo(server);
app.set('llave',config.llave);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/location', location)
module.exports = app;