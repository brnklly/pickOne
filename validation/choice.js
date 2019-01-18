const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateChoiceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";

  if (!Validator.isLength(data.title, { min: 1, max: 50 })) {
    errors.title = "Title cannot be longer than 50 characters";
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
