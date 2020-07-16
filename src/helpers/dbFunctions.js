/**
 * @module helpers/dbFunctions
 */
const db = require("../config/dbConnection");

/**
 * Insert New User into the database table
 * @param {Object} options Object with User Details
 * @param {String} options.firstName First name of the user
 * @param {String} options.lastName Last name of the user
 * @param {String} options.email Email id
 * @param {String} options.password Password
 * @param {String} options.nick Nick Name of the user in the game
 * @param {String|null} options.avatar Avatar in the game
 * @returns {Object} - two field
 */
async function insertUser({
  firstName,
  lastName,
  email,
  password,
  nick,
  avatar = null,
}) {
  try {
    sql = `INSERT INTO user (firstName, lastName, email, password, nick, avatar) VALUES 
          ('${firstName}', '${lastName}', '${email}', '${password}',
           '${nick}', '${avatar}')`;

    result = await db.query(sql);
    return { err: null, result: result };
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY" || err.errno == 1062) {
      // check if the email field is duplicate
      if (err.toString().indexOf("email") !== -1) {
        return { err: "Email is already used", result: null };
      }

      // check if the nick field is duplicate
      else if (err.toString().indexOf("nick") !== -1) {
        return { err: "Nick name is already used", result: null };
      }
    }
    // for other errors
    else {
      return { err: err.toString(), result: null };
    }
  }
}

/**
 * Insert token into the table
 * @param {String} email
 * @param {String} token
 * @param {Boolean|false} used
 * @returns {Object} Contains Either error or the result
 */
async function insertToken(email, token, used = false) {
  sql = `INSERT INTO resettoken (email, token, expireTime, used) VALUES 
          ('${email}', '${token}', ADDDATE(NOW(),INTERVAL 1 HOUR), ${used})`;

  result = await query(sql);
  return result;
}

/**
 * Delete the token from the given table based on the email provided
 * @param {String} email Email of the User
 * @returns {Object} Contains Either error or the result
 */
async function deleteTokensByEmail(email) {
  let sql = `DELETE FROM resettoken WHERE email='${email}'`;
  await query(sql);
}

/**
 * Change the token status to true
 * @param {String} email Email of the User
 * @returns {Object} Contains Either error or the result
 */
async function updateTokenUsedStatus(email) {
  let sql = `UPDATE resettoken SET used=1 WHERE email='${email}'`;
  result = await query(sql);
  return result;
}

/**
 * Search the table for the given token
 * @param {String} token Reset Token
 * @returns {Object} Contains Either error or the result
 */
async function searchByToken(token) {
  let sql = `SELECT * FROM resettoken WHERE token = '${token}'`;
  result = await query(sql);
  return result;
}

/**
 * Search the user table using the given email
 * @param {String} email Email of the user
 * @returns {Object} Contains Either error or the result
 */
async function searchUserByEmail(email) {
  let sql = `SELECT * FROM user WHERE email = '${email}'`;
  result = await query(sql);
  return result;
}

/**
 * Search the User table using the given ID
 * @param {Number} id ID of the user
 * @returns {Object} Contains Either error or the result
 */
async function searchUserById(id) {
  let sql = `SELECT * FROM user WHERE id = '${id}'`;
  result = await query(sql);
  return result;
}

/**
 * Function to abstract Query handling
 * @param {String} sql SQL Query Statement to execute
 * @returns {Object} Contains Either error or the result
 */
async function query(sql) {
  try {
    result = await db.query(sql);
    return { err: null, result: result };
  } catch (error) {
    return { err: error.toString(), result: null };
  }
}

/**
 * Search the user table for rows like the given value
 * @param {String} field Field or the column in the table
 * @param {String} value Value to be searched in the table
 * @returns {Object} Contains Either error or the result
 */
async function searchUserByField(field, value) {
  sql = `SELECT id,nick from user WHERE ${field} like '%${value}%'`;
  return await query(sql);
}

module.exports = {
  insertUser,
  searchUserByEmail,
  searchUserById,
  searchByToken,
  insertToken,
  deleteTokensByEmail,
  updateTokenUsedStatus,
  searchUserByField,
  query,
};
