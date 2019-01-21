import axios from "axios";
import { GET_GROUP, GET_ERRORS } from "./types";

// add choice
export const addChoice = choiceData => dispatch => {
  axios
    .post(`/api/choices/add/groups/${choiceData.group}`, choiceData)
    .then(res => {
      dispatch({
        type: GET_GROUP,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// edit choice
export const editChoice = choiceData => dispatch => {
  axios
    .post(
      `/api/choices/${choiceData.id}/edit/groups/${choiceData.group}`,
      choiceData
    )
    .then(res => {
      dispatch({
        type: GET_GROUP,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// delete choice
export const deleteChoice = (id, group) => dispatch => {
  axios
    .delete(`/api/choices/${id}/delete/groups/${group}`)
    .then(res => {
      dispatch({
        type: GET_GROUP,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
