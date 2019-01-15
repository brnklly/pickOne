const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// load validation
const validateRegisterInput = require("../../validation/register");

// load models
const User = require("../../models/User");

// @route     GET /api/users/test
// @desc      Test users routes
// @access    Public
router.get("/test", (req, res) => {
  res.json({ msg: "users works" });
});

// @route     GET /api/users/register
// @desc      Register new user
// @access    Public
router.post("/register", (req, res) => {
  // check for validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check for existing email
  User.findOne({ email: req.body.email })
    .then(user => {
      // check for user
      if (user) {
        return res.status(404).json({ email: "Email already exists" });
      }

      // create new user
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      // hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // replace password
          newUser.password = hash;
          // save new user
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
