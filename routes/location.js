var express = require('express');
var router = express.Router();
var connection = require('./../config/db');
router.get('/', function(req, res, next) {
    res.send('hola');
});


module.exports = router;
//https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo?hl=en