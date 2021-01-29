'use strict';

var mysql = require('mysql');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'adminexpress'
});

migration.init(connection, `${__dirname}/database/migrations`, function() {
  console.log("finished running migrations");
});