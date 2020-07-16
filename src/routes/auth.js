/**
 * @module routes/auth
 *
 */
const express = require("express");
const router = express.Router();

const {
  loginController,
  registrationController,
  forgotPasswordController,
  resetPasswordHandler,
} = require("../controllers/auth");

/**
 * Route for User registration
 *
 * @name Registration Route
 * @route {POST} /api/v1/auth/register
 * @bodyparam {String} firstName
 * @bodyparam {String} lastName
 * @bodyparam {String} email
 * @bodyparam {String} password
 * @bodyparam {String} nick
 * @bodyparam {String} avatar
 */
router.post("/register", registrationController);
/**
 * Route for User login
 *
 * @name Login Route
 * @route {POST} /api/v1/auth/login
 * @bodyparam {String} email
 * @bodyparam {String} password
 */
router.post("/login", loginController);
/**
 * Route for Forgot password
 *
 * @name Forgot Password Route
 * @route {POST} /api/v1/auth/forgot-password
 * @bodyparam {String} email
 */
router.post("/forgot-password", forgotPasswordController);
/**
 * Route for password reset
 *
 * @name Reset Password Route
 * @route {GET} /api/v1/auth/reset-password
 * @queryparam {String} token Token generated from forgot password route
 */
router.get("/reset-password", resetPasswordHandler);

module.exports = router;
