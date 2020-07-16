/**
 * @module helpers/validation
 * @requires validator
 */
const validator = require("validator");

/**
 * Validates the password
 * @description
 *  - The password must have atleast 8 characters
 *  - It must be have less than 16 characters
 *  - It must contain atleast one number, one special character and letters from both upper and lower case
 * @param {String} password Password to be validates
 * @returns {Boolean|String} true if there are no errors else the error code
 * @example
 *  const result = passwordValidation("your-password");
 */
function passwordValidation(password) {
  // the password should be between 8 to 16 characters
  // must contain atleast one number
  // must contain atleast one of the special characters [!,@,#,$,%,^,&,*]
  var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  errors = [];
  if (password.length < 8 && password.length > 16) {
    errors.push("Password must be between 8 to 16 characters long.");
  }
  if (!regularExpression.test(password)) {
    errors.push(
      "Password must contain at least one upper case, one lower case, one special character and one number."
    );
  }

  if (errors.length == 0) {
    return true;
  }
  return errors;
}
/**
 * Function to validate the search field entry
 *  - The item should be either email or alpha numeric
 * @param {String} searchItem Field inserted that needs to be searched
 * @returns {Boolean}
 *
 * @example
 * const result = searchValidator(searchItem);
 */
function searchValidator(searchItem) {
  // The item should be either an email or alphanumeric
  return (
    searchItem.length !== 0 &&
    (validator.isEmail(searchItem) || validator.isAlphanumeric(searchItem))
  );
}

/**
 * Validates the registration fields
 * @param {Object} options Object containing the fields given by user
 * @param {String} options.firstName First Name of the user
 * @param {String} options.lastName Last Name of the user
 * @param {String} options.email Email ID of the user
 * @param {String} options.password Password set by the user
 * @param {String} options.nick Nick name set by the user
 * @returns {Boolean|String} true if there are no errors else the error code
 * @example
 *  const options = {
 *    firstName:"first",
 *    lastName:"last",
 *    email:"your-name@domain.com",
 *    password:"your-password",
 *    nick:"nickname"
 * }
 *  const result = registrationValidator({});
 */
function registrationValidator({ firstName, lastName, email, password, nick }) {
  errors = [];

  const passwordValResult = passwordValidation(password);

  if (!validator.isEmail(email)) errors.push("Please enter a valid email id");

  if (passwordValResult != true) errors.push(...passwordValResult);

  if (
    firstName.length < 3 &&
    firstName.length > 10 &&
    validator.isAlpha(firstName)
  )
    errors.push("First name should between 3 to 10 characters long ");

  if (
    lastName.length < 3 &&
    lastName.length > 10 &&
    validator.isAlpha(lastName)
  )
    errors.push("Last name should be between 3 to 10 characters long");

  if (nick.length < 3 && validator.isAlphanumeric(nick))
    errors.push(
      "Nickname should be between 3 to 10 alpha numeric characters long"
    );

  if (errors.length == 0) return true;
  return errors[0];
}
/**
 * @description Validates the email and password fields entered by the user
 * @param {String} email Email ID entered by the user
 * @param {String} password Password entered by the user
 * @returns {Boolean} true if both the fields are valid else false
 * @example
 * const result = loginValidator(email,password)
 */
function loginValidatior(email, password) {
  if (!validator.isEmail(email) && password.length < 8 && password.length > 16)
    return false;
  return true;
}

module.exports = {
  registrationValidator,
  loginValidatior,
  searchValidator,
};
