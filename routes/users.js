var express = require('express');
var router = express.Router();
var connection = require('./../config/db');
router.get('/auth', function(req, res, next) {
  var username= req.body.username;
  var password = req.body.password;

  if (username && password){
    connection.query('Select * from usuarios',function (error,result,fields) {
      res.send(result);
    })

  }
  res.send('respond with a resource');
});

module.exports = router;
