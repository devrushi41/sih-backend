/**
 * @module controllers/user
 */

const dbFunctions = require("../helpers/dbFunctions");
const { searchValidator } = require("../helpers/validations");

/**
 * Searches the user based on the query parameter
 *
 * @param {express.Request} req Request Object
 * @param {express.Response} res Response Object
 * @returns {undefined}
 */
const searchUserController = async function (req, res) {
  const count = Object.keys(req.query).length;
  // if the number of parameters is greater than one
  if (count !== 1) {
    return res.status(400).json({ err: "Invalid query" });
  }

  const { email, id, nick } = req.query;
  if (email && searchValidator(email)) {
    data = await dbFunctions.searchUserByField("email", email);
    return res.status(200).json({ result: data.result });
  }
  if (nick && searchValidator(nick)) {
    data = await dbFunctions.searchUserByField("nick", nick);
    return res.status(200).json({ result: data.result });
  }
  if (id && searchValidator(id)) {
    data = await dbFunctions.searchUserByField("id", id);
    return res.status(200).json({ result: data.result });
  }

  return res.status(400).json({ err: "Invalid query" });
};

module.exports = {
  searchUserController,
};
