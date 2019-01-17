const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEditAccountInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.current = !isEmpty(data.current) ? data.current : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // email check
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  // current password check
  if (Validator.isEmpty(data.current)) {
    errors.current = "Current password field is required";
  }

  // new password check
  if (!Validator.isEmpty(data.password)) {
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "Password must be between 6 and 30 characters";
    }

    // check passwords match
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = "Passwords must match";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
