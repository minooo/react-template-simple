import { get as _get } from "lodash/object";
import appConfig from "../1-config/app_config"

export default (key) => {
  if (!Window.AppConfig && process.env.NODE_ENV !== "production") {
    Window.AppConfig = appConfig;
  }

  return _get(Window.AppConfig, key);
}
