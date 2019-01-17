const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateEditAccountInput = require("../../validation/edit-account");

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
              id: user.id,
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

// @route     GET /api/users/current
// @desc      Get current user
// @access    Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  }
);

// @route     POST /api/users/:id/edit
// @desc      Edit user email && || password
// @access    Private
router.post(
  "/:id/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check for validation
    const { errors, isValid } = validateEditAccountInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // takes in arguments
    // args => 'email', 'current', 'password', 'password2'

    // find User
    User.findOne({ _id: req.user.id })
      .then(user => {
        // check for correct password
        bcrypt
          .compare(req.body.current, user.password)
          .then(isMatch => {
            if (isMatch) {
              const checkNewEmail = new Promise((resolve, reject) => {
                // check if email is changed
                if (req.body.email !== user.email) {
                  // email changed
                  User.findOne({ email: req.body.email })
                    .then(user => {
                      if (user) {
                        reject({
                          email: "Email is taken"
                        });
                      } else {
                        resolve(req.body.email);
                      }
                    })
                    .catch(err => reject(err));
                } else {
                  resolve(null);
                }
              });

              const checkNewPassword = new Promise((resolve, reject) => {
                // check if there is a new password
                if (req.body.password.trim().length > 0) {
                  // check if new password equals old
                  bcrypt
                    .compare(req.body.password, user.password)
                    .then(isMatch => {
                      if (isMatch) {
                        reject({
                          password:
                            "New password must be different than your current"
                        });
                      } else {
                        // hash password
                        bcrypt.genSalt(10, (err, salt) => {
                          if (err) reject(err);
                          bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) reject(err);
                            resolve(hash);
                          });
                        });
                      }
                    })
                    .catch(err => reject(err));
                } else {
                  resolve(null);
                }
              });

              // Run promises and change user values
              Promise.all([checkNewEmail, checkNewPassword])
                .then(([email, password]) => {
                  user.email = email ? email : user.email;
                  user.password = password ? password : user.password;

                  // save user
                  user
                    .save()
                    .then(user => {
                      res.json(user);
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            } else {
              res.status(401).json({ password: "Password is incorrect" });
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @route     DELETE /api/users/:id/delete
// @desc      Remove user's account
// @access    Private
router.delete(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // get user
    User.findOneAndDelete({ _id: req.user.id })
      .then(() => {
        res.json({ msg: "User deleted" });
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
