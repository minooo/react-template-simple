export const actionTypes = {
  GET_HOME_COLLAGE: "GET_HOME_COLLAGE",
  GET_HOME_COLLAGE_SUCCESS: "GET_HOME_COLLAGE_SUCCESS",
};

// 首页
// home COLLAGE
export const getHomeCollage = () => ({
  type: actionTypes.GET_HOME_COLLAGE
});
export const getHomeCollageSuccess = payload => ({
  type: actionTypes.GET_HOME_COLLAGE_SUCCESS,
  payload
});
