/**
 * @module config/dbConnection
 */
const mysql = require("mysql");

/**
 * @type {function}
 * @description
 * - Creates a database connection
 * - enables async await operations for mysql
 *
 * @see https://stackoverflow.com/a/62575227
 */
function Database() {
  this.connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  this.query = (sql, args) => {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };

  this.close = () => {
    return async () => {
      try {
        this.connection.end((err) => {
          if (err) throw err;
          return;
        });
      } catch (e) {
        return e;
      }
    };
  };
}

module.exports = new Database();
