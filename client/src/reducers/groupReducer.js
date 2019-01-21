import { GET_GROUPS, GROUPS_LOADING, GET_GROUP } from "../actions/types";

const initialState = {
  groups: [],
  group: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GROUPS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_GROUPS:
      return {
        ...state,
        groups: action.payload,
        group: null,
        loading: false
      };
    case GET_GROUP:
      return {
        ...state,
        group: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
