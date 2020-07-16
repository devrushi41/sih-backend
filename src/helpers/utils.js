/**
 * Contains Utility functions
 * @module helpers/utils
 * @requires jsonwebtoken
 */
const jsonWebToken = require("jsonwebtoken");

/**
 * Generates a JWT Token for the user
 * @param {Number} id User ID
 * @returns {String} Signed Token
 *
 * @example
 * const token = utils.issueJWT(id);
 */
function issueJWT(id) {
  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jsonWebToken.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return signedToken;
}
/**
 * Capitlizes First Letter in the String
 * @param {String} str Name of the User
 * @return {String} Capitalised String
 *
 * @example
 * const modifiedString = capitalizeFirstLetter(str);
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  issueJWT,
  capitalizeFirstLetter,
};
