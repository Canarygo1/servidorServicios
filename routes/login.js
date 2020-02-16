var express = require('express');
var router = express.Router();
const connectionDb = require('./../config/db');
const bcrypt = require('bcrypt');
let Users = require('./../dataModel/User');
let User = Users.User;
var config = require('../config/config');
const saltRound = 10;
var jwt = require('jsonwebtoken');
var connection = connectionDb.dbConnection();
router.post('/auth', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);
    getUser(email)
        .then((rows) => {
            console.log(rows.length);
            var passwordDb = rows[0].password;
            bcrypt.compare(password, passwordDb).then((response) => {
                var token = jwt.sign({id: 1234}, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                if (rows.length > 0) {
                    res.json({
                        success: true,
                        message: 'Authentication successful',
                        token: token
                    });

                }
            })
        }).catch(() => {
        res.json({
            success: false,
            message: 'Authentication error',
            token: "error"
        });
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
            if (error != null || result.length === 0) {
                console.log(error);
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
        res.json({
            "code": 200,
            "responseType": "User created"
        });
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
