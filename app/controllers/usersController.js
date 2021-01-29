const connection = require('./../../database/connection.js');
const moment = require('moment');

module.exports = {
    index: () => {

    },
    create: (data) => {
        connection.beginTransaction(function(err) {
            let query;
            if (!err){
                let date = moment().format('YYYY-MM-DD hh:mm:ss');
                query = `SELECT * FROM users where code = ${data.from.id}`;
                connection.query(query, function(err, result) {
                    if (!err) {
                        if(!result.length){
                            query = `INSERT INTO users (code, name, created_at, updated_at, deleted_at) VALUES ("${data.from.id}", "${data.from.first_name} ${data.from.last_name}", "${ date }", "${ date }", NULL)`;
                            connection.query(query, function(err, result) {
                                if (!err) {
                                    connection.commit();
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    createLocation: (data) => {
        connection.beginTransaction(function(err) {
            let query;
            if (!err){
                let date = moment().format('YYYY-MM-DD hh:mm:ss');
                query = `SELECT * FROM users where code = ${data.from.id}`;
                connection.query(query, function(err, result) {
                    if (!err) {
                        if(result.length){
                            query = `INSERT INTO locations
                                        (user_id, latitude, longitude, created_at, updated_at, deleted_at) VALUES
                                        (${result[0].id}, "${data.location.latitude}", "${data.location.longitude}", "${ date }", "${ date }", NULL)`;
                            connection.query(query, function(err, result) {
                                if (!err) {
                                    connection.commit();
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}