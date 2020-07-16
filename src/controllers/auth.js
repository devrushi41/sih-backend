/**
 * @module controllers/auth
 */
const validations = require("../helpers/validations");
const dbFunctions = require("../helpers/dbFunctions");
const UserModel = require("../models/user");
const utils = require("../helpers/utils");
const {
  sendWelcomeMail,
  sendResetPassword,
} = require("../helpers/mailService");
const express = require("express");
const ResetTokenModel = require("../models/resetToken");

/**
 *  Registration Controller
 *  @description
 *  - Validates the fields
 *  - Checks if the email exists
 *  - Adds to the database
 *  - Sends a welcome mail
 *  @param {express.Request} req
 *  @param {express.Response} res
 *  @returns {undefined}
 */
async function registrationController(req, res) {
  try {
    // validate fields
    const fieldValidations = validations.registrationValidator(req.body);

    // if errors in fields
    if (fieldValidations != true) {
      return res.status(400).json({
        error: fieldValidations,
      });
    }

    // else create user
    let userModel = new UserModel(req.body);
    await userModel.hashPassword();

    // querying database
    let data = await dbFunctions.insertUser(userModel);

    // if there is error
    if (data.err) {
      return res.status(400).json({
        err: data.err,
      });
    }

    // else the user is created
    name =
      utils.capitalizeFirstLetter(req.body.firstName) +
      " " +
      utils.capitalizeFirstLetter(req.body.lastName);
    email = req.body.email;

    // send mail to the user
    sendWelcomeMail(email, name);
    return res.status(200).json({
      message: "User created",
      ID: data.result.insertId,
    });
  } catch (err) {
    console.log(err.toString());
  }
}

/**
 *  Login Controller
 *  @description
 *  - Validates the fields
 *  - Checks if the Email exists
 *  - Validates the Password
 *  @param {express.Request} req
 *  @param {express.Response} res
 *  @returns {undefined}
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // validate fields
    const fieldValidations = validations.loginValidatior(email, password);

    // if errors
    if (!fieldValidations) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    //else get user details
    let data = await dbFunctions.searchUserByEmail(req.body.email);

    // if there is error
    if (data.err) {
      return res.status(400).json({
        err: "Invalid username or password",
      });
    }

    if (!data.result[0]) {
      // if user not found
      return res.status(400).json({
        error: "User not found, create an account to continue",
      });
    }
    const userModel = new UserModel(data.result[0]);

    // validate the entered password
    if (await userModel.isValidPassword(req.body.password)) {
      // send the jwt token
      const token = utils.issueJWT(userModel.id);
      return res.status(200).json({
        success: true,
        token: token,
      });
    }
    // if invalid password
    res.status(400).json({
      error: "Invalid username or password",
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 *  Forgot Password Controller
 *  @description
 *  - Checks if the email exists
 *  - Generates token
 *  - Sends Reset Token Mail
 *  @param {express.Request} req
 *  @param {express.Response} res
 *  @returns {undefined}
 */
async function forgotPasswordController(req, res) {
  const { email } = req.body;
  let data = await dbFunctions.searchUserByEmail(email);

  // if the mail is not present in the database
  if (!data.result[0]) {
    return res.json({ message: "sent" });
  }
  const resetToken = new ResetTokenModel({ email: email });
  await resetToken.generateToken();

  // delete all the tokens in the database with the email given
  await dbFunctions.deleteTokensByEmail(email);

  // store in database
  data = await dbFunctions.insertToken(
    resetToken.email,
    resetToken.token,
    resetToken.used
  );
  if (data.err) {
    return res.json({ message: "sent" });
  }
  // send message
  sendResetPassword(resetToken.email, resetToken.token);

  // token added for postman requests
  return res.json({ message: "sent", token: resetToken.token });
}

/**
 *  Reset Password Handler
 *  @description
 *  - Get the token from the request
 *  - Validates the token
 *  @param {express.Request} req
 *  @param {express.Response} res
 *  @returns {undefined}
 */
async function resetPasswordHandler(req, res) {
  // token is sent as a query parameter
  const token = decodeURI(req.query.token);

  // check for the token in the database
  const data = await dbFunctions.searchByToken(token);
  if (!data.result[0]) {
    // if token is not in database
    return res.status(400).json({ status: "the token is already used" });
  }
  const resetToken = new ResetTokenModel(data.result[0]);
  // if token expired or already used
  if (new Date(resetToken.expireTime) <= new Date() || resetToken.used) {
    await dbFunctions.deleteTokensByEmail(resetToken.email);

    return res.status(400).json({ status: "the token is already used" });
  }

  resetToken.used = 1;
  await dbFunctions.updateTokenUsedStatus(resetToken.email);
  await dbFunctions.deleteTokensByEmail(resetToken.email);

  res.status(200).json({ status: "ok" });
}

module.exports = {
  registrationController,
  loginController,
  forgotPasswordController,
  resetPasswordHandler,
};
