/**
 *
 * @module models/resetTokenModel
 * @requires bcrypt
 */
const bcrypt = require("bcrypt");

/**
 * Reset Token model
 *
 * @example
 * const options = {
 *  email:"yourname@domain.com",
 *  token:"token-string",
 *  expireTime:2020-07-08 12:20:20,
 *  used:false
 * };
 *
 * const resetToken = new ResetToken(options);
 */
class ResetTokenModel {
  /**
   *
   * @param {Object} options
   * @param {String} options.email Email of the user
   * @param {String|null} options.token Reset token generated
   * @param {Date|null} options.expireTime When the token expires
   * @param {Boolean|false} options.used Whether the token is used or not
   */
  constructor({ email, token = null, expireTime = null, used = false }) {
    this.email = email;
    this.token = token;
    this.expireTime = expireTime;
    this.used = used;
  }

  /**
   * Generates new reset token
   * @returns {String}  New reset token
   *
   * @example
   * const token = await resetToken.generateToken()
   */
  async generateToken() {
    try {
      const salt = await bcrypt.genSalt(
        parseInt(process.env.PASSWORD_RESET_SECRET)
      );
      const hash = await bcrypt.hash(this.email, salt);
      //   set the token
      this.token = hash;

      return hash;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Checks if the token is present in the database
   * @param {String} token The token to be validated
   * @returns {Boolean} true if the token is in database else false
   *
   * @example
   * const result = await resetToken.isValidToken(tokenToBeChecked)
   */
  async isValidToken(token) {
    const compare = await bcrypt.compare(token, this.email);
    return compare;
  }
}

module.exports = ResetTokenModel;
