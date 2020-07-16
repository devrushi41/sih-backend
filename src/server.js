const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
/**
 * @requires express
 * @requires body-parser
 * @requires morgan
 * @requires passport
 * @requires dotenv
 */
const app = express();

require("dotenv").config();
require("./config/passport")(passport);

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// database connection

const PORT = process.env.PORT || 3000;
// user routes
const routes = require("./routes/index");

// routes
app.use("/api/v1/", routes);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});
// for the rest of the routes

app.use((err, req, res, next) => {
  res.status(err.status || 404);
  res.json({ error: err });
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
