import { actionTypes } from "@actions";

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_HOME_COLLAGE_SUCCESS:
      return [...(action.payload && action.payload)]
    default:
      return state;
  }
};
