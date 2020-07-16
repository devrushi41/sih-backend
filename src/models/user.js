/**
 * @module models/usermodel
 * @requires bcrypt
 */
const bcrypt = require("bcrypt");

/**
 * User Model
 *
 * @example
 * const options ={
 * firstName:"first",
 * lastName:"last",
 * email:"yourname@domain.com",
 * password:"your-password",
 * nick:"nickName"
 * };
 *
 * const userModel = new UserModel(options);
 */
class UserModel {
  /**
   *
   * @param {Object} options
   * @param {String} options.firstName First name of the user
   * @param {String} options.lastName Last name of the user
   * @param {String} options.email Email id
   * @param {String} options.password Password for the account
   * @param {String} options.nick Nick name used in the game
   * @param {number|null} options.id ID generated for the user
   */
  constructor({
    firstName,
    lastName,
    email,
    password,
    nick,
    avatar,
    id = null,
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.nick = nick;
    this.avatar = avatar;
    this.id = id || null;
  }

  /**
   * Hashes the password and stores in the userModel.password
   *
   * @example
   * await userModel.hashPassword();
   */
  async hashPassword() {
    try {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Validates the entered password
   *
   * @param {String} password Password entered by the user at login
   * @returns {Boolean} true if the password is valid, else false
   * @example
   * const result = await userModel.isValidPassword(enteredPassword)
   */
  async isValidPassword(enteredPassword) {
    const compare = await bcrypt.compare(enteredPassword, this.password);
    return compare;
  }
}
module.exports = UserModel;
