/**
 * @module config/passport
 * @requires passport-jwt
 * @requires helpers/dbFuncions
 * @requires models/user
 */
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { searchUserById } = require("../helpers/dbFunctions");
const UserModel = require("../models/user");

require("dotenv").config();

/**
 * @typedef {passportJWTOptions} passportJWTOptions
 * @property {String} secretOrKey - JWT Secret
 * @property {String} jwtFromRequest - Extracted JWT from Auth Header
 */
/**
 * Options passed to the JWT Strategy
 * @type {passportJWTOptions}
 * @description
 * <pre>
 * const passportJWTOptions = {
 * secretOrKey: process.env.JWT_SECRET,
 * jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
 * };
 * </pre>
 */
const passportJWTOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 *  Strategy for Passport JWT
 *  @type {JWTStrategy}
 *  @see http://www.passportjs.org/packages/passport-jwt/
 *
 */
const strategy = new JWTStrategy(passportJWTOptions, async (payload, done) => {
  try {
    // find users specified in token
    const data = await searchUserById(payload.sub);

    // if doesnt exist handle it
    if (!data.result[0]) {
      return done(null, false);
    }

    // other wise return the user
    const user = new UserModel(data.result[0]);
    user.password = undefined;
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
