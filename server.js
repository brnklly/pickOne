const express = require("express");

// import routes
const users = require("./routes/api/users");
const groups = require("./routes/api/groups");
const choices = require("./routes/api/choices");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to PickOne");
});

// use routes
app.use("/api/users", users);
app.use("/api/groups", groups);
app.use("/api/choices", choices);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
