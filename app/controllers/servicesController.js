const connection = require('./../../database/connection.js');
const moment = require('moment');

module.exports = {
    index: () => {

    },
    find: (id) => {
        let query;
        let date = moment().format('YYYY-MM-DD hh:mm:ss');
        query = `SELECT * FROM services as s, locations as l, users as u where s.location_id = l.id and l.user_id = u.id and s.id = ${id}`;
        return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) return reject(err);
                return resolve(results);
            });
        });
    },
    findLast: (code) => {
        let query;
        let date = moment().format('YYYY-MM-DD hh:mm:ss');
        query = `SELECT s.*, u.code FROM drivers as d, services as s, locations as l, users as u
                    where d.id = s.driver_id and s.location_id = l.id and l.user_id = u.id and d.code = ${code}`;
        return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) return reject(err);
                return resolve(results);
            });
        });
    },
    create: (location_id, driver_id) => {
        console.log(location_id, driver_id);
        let date = moment().format('YYYY-MM-DD hh:mm:ss');
        let query = `INSERT INTO services (location_id, driver_id, status, created_at, updated_at, deleted_at) VALUES (${ location_id }, ${ driver_id }, 1, "${ date }", "${ date }", NULL)`;
        return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) return reject(err);
                return resolve(results.insertId);
            });
        });
    }
}