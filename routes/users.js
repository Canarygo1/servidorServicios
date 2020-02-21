var express = require('express');
var router = express.Router();
const connectionDb = require('./../config/db');


var connection = connectionDb.dbConnection();
router.post('/prueba', function(req, res, next) {
  console.log("info");
  var email= req.body.email;

    connection.query('Select * from usuarios where correo = ?',email,function (error,result,fields) {
      res.send(result);
    });

});

router.get('/all',function (req,res,next) {
    connection.query('Select trabajo.id, trabajo.tiposervicio, trabajo.fechatrabajo, trabajo.masinformacion, trabajo.preciotrabajo,'+
        ' trabajo.votacion, CONCAT(usuarios.nombre, " ", usuarios.apellidos) AS nombre from trabajo JOIN usuarios ON usuarios.id = trabajo.idempleador',function (erros,result,fields) {
        res.send(result)
    })
});
module.exports = router;
