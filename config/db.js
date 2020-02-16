const mysql = require('mysql');

var connection;

module.exports = {

    dbConnection: function () {

        connection = mysql.createPool({
            host: 'eu-cdbr-west-02.cleardb.net',
            user: 'b10b4416669ce5',
            password: '6253999d',
            database: 'heroku_56c9bb40abbb332'
        });

        return connection;
    }

};