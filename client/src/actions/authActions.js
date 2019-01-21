import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { SET_CURRENT_USER, GET_ERRORS } from "./types";

// register user
export const registerUser = (newUser, history) => dispatch => {
  axios
    .post("/api/users/register", newUser)
    .then(res => history.push("/login"))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// login user
export const loginUser = (loginAttempt, history) => dispatch => {
  axios
    .post("/api/users/login", loginAttempt)
    .then(res => {
      // save to local storage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      // set token to auth header
      setAuthToken(token);

      // decode token for user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));

      // go to dashboard
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localstorage
  localStorage.removeItem("jwtToken");
  // delete auth header
  setAuthToken(false);
  // set current user to {} to update redux
  dispatch(setCurrentUser({}));
};

// edit user
export const editUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/edit", userData)
    .then(res => history.push("/dashboard"))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// set current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
