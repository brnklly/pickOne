const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateChoiceInput(data, type) {
  let errors = {};

  if (type === "add") {
    data.title = !isEmpty(data.title) ? data.title : "";

    if (!Validator.isLength(data.title, { min: 1, max: 50 })) {
      errors.addChoiceTitle = "Title cannot be longer than 50 characters";
    }
    if (Validator.isEmpty(data.title)) {
      errors.addChoiceTitle = "Title field is required";
    }
  }

  if (type === "edit") {
    data.title = !isEmpty(data.title) ? data.title : "";
    if (!Validator.isLength(data.title, { min: 1, max: 50 })) {
      errors.editChoiceTitle = "Title cannot be longer than 50 characters";
    }
    if (Validator.isEmpty(data.title)) {
      errors.editChoiceTitle = "Title field is required";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
