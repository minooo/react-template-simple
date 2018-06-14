export default () => next => action => {
  if (action.type === "@@router/LOCATION_CHANGE") {
    console.info("路由变化了哦！");
  }
  return next(action);
};
