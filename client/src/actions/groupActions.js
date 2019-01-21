import axios from "axios";
import { GET_GROUP, GET_GROUPS, GROUPS_LOADING, GET_ERRORS } from "./types";

// get user's groups
export const getGroups = () => dispatch => {
  dispatch(setGroupsLoading());
  axios
    .get("/api/groups")
    .then(res => {
      dispatch({
        type: GET_GROUPS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

// add group
export const addGroup = groupData => dispatch => {
  axios
    .post("/api/groups/add", groupData)
    .then(res => {
      dispatch({
        type: GET_GROUPS,
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

// get group
export const getGroup = groupID => dispatch => {
  dispatch(setGroupsLoading());
  axios
    .get(`/api/groups/${groupID}`)
    .then(res => {
      dispatch({
        type: GET_GROUP,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

// edit group
export const editGroup = groupData => dispatch => {
  axios
    .post(`/api/groups/${groupData.id}/edit`, groupData)
    .then(res => {
      dispatch({
        type: GET_GROUP,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

// delete group
export const deleteGroup = (groupID, history) => dispatch => {
  axios
    .delete(`/api/groups/${groupID}/delete`)
    .then(() => history.push("/dashboard"))
    .catch(err => console.log(err));
};

// groups loading
export const setGroupsLoading = () => {
  return {
    type: GROUPS_LOADING
  };
};
