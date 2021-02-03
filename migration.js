'use strict';

var mysql = require('mysql');
var migration = require('mysql-migrations');

const config = require(`${__dirname}/config.js`);

var connection = mysql.createPool({
  connectionLimit : 10,
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.name
});

migration.init(connection, `${__dirname}/database/migrations`, function() {
  console.log("Migración finalizada");
});