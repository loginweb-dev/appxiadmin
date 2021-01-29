'use strict';

const mysql = require('mysql');

const config = require(`./../config.js`);

const connection = mysql.createConnection({
    host: config.database.host,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
});

connection.connect();

module.exports = connection;