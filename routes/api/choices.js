const express = require("express");
const router = express.Router();
const passport = require("passport");

// load functions
const formatGroup = require("../../functions/format-group");

// load validation
const validateChoiceInput = require("../../validation/choice");

// load models
const Choice = require("../../models/Choice");
const Group = require("../../models/Group");

// @route     GET /api/choices/test
// @desc      Test choices routes
// @access    Public
router.get("/test", (req, res) => {
  res.json({ msg: "choices works" });
});

// @route     GET /api/choices/add/groups/:group
// @desc      Add a choice to a group
// @access    Private
router.get(
  "/add/groups/:group",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check for validation
    const { errors, isValid } = validateChoiceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // check that group exists
    Group.findOne({ user: req.user.id, _id: req.params.group })
      .then(group => {
        if (!group) {
          return res.status(404).json({ msg: "Group not found" });
        }

        // create new choice
        const newChoice = new Choice({
          user: req.user.id,
          group: group._id,
          title: req.body.title
        });
        // save choice
        newChoice
          .save()
          .then(choice => {
            // return group with choices
            Choice.find({ group: group._id })
              .then(choices => {
                res.json(formatGroup(group, choices));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @route     POST /api/choices/:choice/edit/groups/:group
// @desc      Edit a choice
// @access    Private
router.post(
  "/:choice/edit/groups/:group",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // validation
    const { errors, isValid } = validateChoiceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // find group by user and :group
    // find choice by :choice
    Promise.all([
      Group.findOne({ user: req.user.id, _id: req.params.group }),
      Choice.findOne({ _id: req.params.choice })
    ])
      .then(([group, choice]) => {
        // check for group
        if (!group) {
          return res.status(404).json({ msg: "Group not found" });
        }
        // check for choice
        if (!choice) {
          return res.status(404).json({ msg: "Choice not found" });
        }

        // change choice title
        choice.title = req.body.title;

        // save choice and get choices
        choice
          .save()
          .then(choice => {
            Choice.find({ group: group._id })
              .then(choices => {
                // return group formatted
                res.json(formatGroup(group, choices));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @route     DELETE /api/choices/:choice/delete/groups/:group
// @desc      Delete a choice
// @access    Private
router.delete(
  "/:choice/delete/groups/:group",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // find group by user and :group
    // find choice
    Promise.all([
      Group.findOne({ user: req.user.id, _id: req.params.group }),
      Choice.findOne({ _id: req.params.choice })
    ])
      .then(([group, choice]) => {
        // check for group
        if (!group) {
          return res.status(404).json({ msg: "Group not found" });
        }
        // check for choice
        if (!choice) {
          return res.status(404).json({ msg: "Choice not found" });
        }

        // delete choice
        choice
          .remove()
          .then(() => {
            // find choices
            Choice.find({ group: group._id })
              .then(choices => {
                // return formatted group
                res.json(formatGroup(group, choices));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
