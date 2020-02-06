var express = require('express');
var router = express.Router();
const connection = require('./../config/db');
const bcrypt = require('bcrypt');
let Users = require('./../dataModel/User');
let User = Users.User;
var config = require('../config/config');
const saltRound = 10;
var jwt = require('jsonwebtoken');
/* GET home page. */
//TODO:https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwiqgKP7pbvnAhWYAWMBHTxTBS8QwqsBMAB6BAgKEAQ&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dmbsmsi7l3r4&usg=AOvVaw1egQUDkTxXtJ_8LA3SlHXW
router.post('/auth', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    //TODO: de la consulta sacar la contraseña para compararlo.
    console.log(email);
    getUser(email)
        .then((rows) => {
            console.log(rows);
            var passwordDb = rows[0].password;
            bcrypt.compare(password, passwordDb).then((response) => {
                if (response) {
                    res.json({
                        success: true,
                        message: 'Authentication successful',
                        token: token
                    });
                } else {
                    res.json({
                        ssuccess: false,
                        message: 'Authentication error',
                        token: null
                    });
                }
            })
        });
});
router.post('/prueba', function (req, res, next) {
    var token = jwt.sign({id: 1234}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.json({
        success: true,
        message: 'Authentication successful!',
        token: token
    });
});

function getUser(email) {
    return new Promise((resolve, reject) => {
        connection.query("Select password from usuarios where correo = ?", email, function (error, result, fields) {
            if (error != null) {
                reject(error);
            }
            resolve(result);
        })
    })
}

function register(user) {
    return new Promise((resolve, reject) => {

        connection.query("INSERT INTO usuarios (nombre, apellidos,fechanacimiento, correo, password, telefono, vip) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [user.nombre, user.apellidos, user.fechaNacimiennto, user.correo, user.password, user.telefono, user.vip],
            (error, result, fields) => {
                if (error) {
                    reject();
                }
                resolve();

            });

    })
}

router.post('/register', function (req, res, next) {
    //VARIABLES OBLIGATORIAS;
    passwordEncryption(req.body.password).then((hash) => {
        let user = new User(req.body.nombre, req.body.apellidos, req.body.correo, req.body.fechaNacimiento, hash,
            req.body.telefono);

        //TODO: HACER metodo de checkear is hay algo vacio o undefined.
        return user;
    }).then((user) => {
        return register(user)
    }).then(() => {
        res.send("User created");
    }).catch(error => res.send("error in the user creation"));
});

function passwordEncryption(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRound, function (err, hash) {
            console.log(hash);
            resolve(hash);
            reject(err);
        })
    })
}

module.exports = router;
