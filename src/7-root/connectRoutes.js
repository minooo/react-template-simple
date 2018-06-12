import React from "react";
import { Route } from "react-router-dom";
import uuid from "uuid/v4"

import homeRoutes from "../2-pages/0-home/routes";
import myRoutes from "../2-pages/1-my/routes";

const allRoutes = [].concat(homeRoutes, myRoutes);

const routesConfig = allRoutes.map(route => (
  <Route key={uuid()} exact {...route} />
));

export default routesConfig;
