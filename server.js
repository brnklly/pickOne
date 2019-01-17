const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// import routes
const users = require("./routes/api/users");
const groups = require("./routes/api/groups");
const choices = require("./routes/api/choices");

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// config db
const db = require("./config/keys").mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// passport middleware and config
app.use(passport.initialize());
require("./config/passport")(passport);

// routes
app.get("/", (req, res) => {
  res.send("Welcome to PickOne");
});

// use routes
app.use("/api/users", users);
app.use("/api/groups", groups);
app.use("/api/choices", choices);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
