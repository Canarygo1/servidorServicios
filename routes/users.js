var express = require('express');
var router = express.Router();
const connectionDb = require('./../config/db');


var connection = connectionDb.dbConnection();
router.post('/info', function(req, res, next) {
  console.log("info");
  var email= req.body.email;

    connection.query('Select * from usuarios where correo = ?',email,function (error,result,fields) {
      res.send(result);
    })

});

module.exports = router;
