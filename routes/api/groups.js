const express = require("express");
const router = express.Router();
const passport = require("passport");

// load functions
const formatGroup = require("../../functions/format-group");

// load validation
const validateGroupInput = require("../../validation/group");

// load models
const Group = require("../../models/Group");
const Choice = require("../../models/Choice");

// @route     GET /api/groups/test
// @desc      Test groups
// @access    Public
router.get("/test", (req, res) => {
  res.json({ msg: "groups works" });
});

// @route     POST /api/groups/add
// @desc      Create new group
// @access    Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check for validation
    const { errors, isValid } = validateGroupInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // create new group
    const newGroup = new Group({
      user: req.user.id,
      title: req.body.title
    });

    // save
    newGroup
      .save()
      .then(group => {
        // get all Groups for user
        Group.find({ user: req.user.id })
          .then(groups => {
            res.json(groups);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @route     GET /api/groups/
// @desc      Get all current user's groups
// @access    Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // get all Groups for user
    Group.find({ user: req.user.id })
      .then(groups => {
        res.json(groups);
      })
      .catch(err => console.log(err));
  }
);

// @route     GET /api/groups/:id
// @desc      Get a group
// @access    Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // get group where user id = user and _id = params.id
    Group.findOne({ user: req.user.id, _id: req.params.id })
      .then(group => {
        // check for group
        if (!group) {
          return res.status(404).json({ msg: "Group not found" });
        }

        Choice.find({ group: group._id })
          .then(choices => {
            res.json(formatGroup(group, choices));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @route     GET /api/groups/:id/edit
// @desc      Edit a group
// @access    Private
router.post(
  "/:id/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check for validation
    const { errors, isValid } = validateGroupInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // find group by user and id
    Group.findOne({ user: req.user.id, _id: req.params.id })
      .then(group => {
        // check for group
        if (!group) {
          return res.status(404).json({ msg: "Group not found" });
        }

        // update title
        group.title = req.body.title;

        // save group and return group
        Promise.all([group.save(), Choice.find({ group: group._id })])
          .then(([group, choices]) => {
            res.json(formatGroup(group, choices));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @route     GET /api/groups/:id/delete
// @desc      Delete a group
// @access    Private
router.delete(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // find group by id and user
    // find all choices of the group
    Group.findOne({ user: req.user.id, _id: req.params.id })
      .then(group => {
        if (!group) {
          return res.status(404).json({ msg: "Group not found" });
        }

        // remove group
        // remove choices
        Promise.all([group.remove(), Choice.deleteMany({ group: group._id })])
          .then(() => {
            res.json({ msg: "Group deleted" });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
