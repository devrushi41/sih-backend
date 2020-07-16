const express = require("express");
const router = express.Router();
const passport = require("passport");

const authRoutes = require("./auth");
const secureRoutes = require("./secure");

router.use("/auth", authRoutes);
router.use(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  secureRoutes
);

module.exports = router;
