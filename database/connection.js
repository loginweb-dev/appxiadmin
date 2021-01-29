'use strict';

const mysql = require('mysql');

module.exports = mysql.createConnection({
    host : 'localhost',
    database : 'appxiadmin',
    user : 'root',
    password : 'root',
});