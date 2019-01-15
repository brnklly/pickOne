const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// load validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load models
const User = require("../../models/User");

// @route     GET /api/users/test
// @desc      Test users routes
// @access    Public
router.get("/test", (req, res) => {
  res.json({ msg: "users works" });
});

// @route     POST /api/users/register
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

// @route     POST /api/users/login
// @desc      Return JWT
// @access    Public
router.post("/login", (req, res) => {
  // check for errors
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // get input values
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email })
    .then(user => {
      // check for user
      if (!user) {
        return res.status(404).json({ email: "Email not found" });
      }

      // check password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              email: user.email
            };

            // sign token
            jwt.sign(payload, keys.secretOrKey, (err, token) => {
              if (err) throw err;
              res.json({ token: "Bearer " + token });
            });
          } else {
            res.status(400).json({ password: "Password is incorrect" });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
