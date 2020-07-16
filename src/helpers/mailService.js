/**
 * @module helpers/mailService
 * @requires nodemailer
 * @requires email-templates
 * @requires path
 */
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const path = require("path");

/**
 * Options passed to the nodemailer transporter
 * <pre>
 * const transporterOptions = {
 * host: "smtp.gmail.com",
 * port: 465,
 * secure: true,
 * auth: {
 *   user: process.env.EMAIL_ID,
 *   pass: process.env.MAIL_PASSWORD,
 *  },
 *};
 * </pre>
 */
const transporterOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
};

/**
 * NodeMailer Transporter Instance
 * <pre>
 * const transporter = nodemailer.createTransport(transporterOptions);
 * </pre>
 */
const transporter = nodemailer.createTransport(transporterOptions);

/**
 * Email templates instance
 * <pre ><code>
 * const email = new Email({
 *  message: {
 *    from: "sender@domain.com",
 *  },
 *  send: true,
 *  transport: transporter,
 *  views: {
 *    options: {
 *      extension: "hbs",
 *    },
 *  },
 *  preview: false,
 * });
 * </code></pre>
 */
const email = new Email({
  message: {
    from: process.env.EMAIL_ID,
  },
  send: true,
  transport: transporter,
  views: {
    options: {
      extension: "hbs",
    },
  },
  preview: false,
});

/**
 * Function to abstract the Email Handling
 * @param {String} emailId Email ID of the user
 * @param {String} templateName Template Name
 * @param {Object} locals Locals passed to the template
 * @param {String} flag ENV Flags used to control the emails
 * @returns {null}
 */
async function sendMail(emailId, templateName, locals, flag, subject) {
  const options = {
    template: `../emails/${templateName}`,
    message: {
      from: "Word Cloud <" + process.env.EMAIL_ID + ">",
      to: emailId,
      subject: subject,
    },
    locals: locals,
  };
  try {
    if (flag === "true") {
      await email.send(options);
    }
  } catch (error) {
    console.log(error.toString());
  }
}

/**
 * Send welcome mail to the User
 * @param {String} emailId Email ID of the User
 * @param {String} name Name of the User
 * @returns {null}
 *
 * @example
 * await sendWelcomeMail("your-name@domain.com","your name");
 */
async function sendWelcomeMail(emailId, name) {
  return await sendMail(
    emailId,
    "welcome",
    { name: name },
    process.env.FLAG_SEND_WELCOME_EMAIL,
    "Welcome to Word Cloud"
  );
}

/**
 * Send password reset mail to the User
 * @param {String} emailId Email ID of the User
 * @param {String} token Reset token
 * @returns {null}
 *
 * @example
 * await sendResetPassword("your-name@domain.com","reset-token");
 */
async function sendResetPassword(emailId, token) {
  // reset token link
  const link =
    process.env.DOMAIN +
    "/api/v1/auth/reset-password?token=" +
    encodeURIComponent(token);

  return await sendMail(
    emailId,
    "reset-password",
    { link: link },
    process.env.FLAG_SEND_PASSWORD_RESET_EMAIL,
    "Reset Your Word Cloud Password"
  );
}

module.exports = {
  sendWelcomeMail,
  sendResetPassword,
};
