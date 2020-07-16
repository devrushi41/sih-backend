/**
 * @module routes/secure
 */
const express = require("express");
const { searchUserController } = require("../controllers/user");
const {
  getQueuedGameList,
  declineGameQueue,
  addToGameQueue,
} = require("../controllers/gameQueue");
const router = express.Router();

/**
 * Route for profile check 1
 *
 * @name Profie Route
 * @route {GET} /api/v1/profile
 */
router.get(
  "/profile",

  (req, res, next) => {
    res.json({
      message: "You made it to the secure route",
      user: req.user,
    });
  }
);
/**
 * Route for searching a user
 * @name Search user
 * @route /api/v1/user
 * @queryparam {String} email|id|nick value based on what query has to be done
 */
router.get("/user", searchUserController);

module.exports = router;
