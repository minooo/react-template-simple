import { common, config, wxapi } from "@utils"

export default () => next => action => {
  if (action.type === "@@router/LOCATION_CHANGE") {
    if (common.isAndroid()) {
      wxapi.setConfig({ ...config("wx").jsConfig });
    }
    console.info("路由变化了哦！");
  }
  return next(action);
};
