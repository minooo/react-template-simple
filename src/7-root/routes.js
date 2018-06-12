import React from "react";
import { Route, Switch } from "react-router-dom";
import allRoutes from "./connectRoutes";
import NotFound from "../2-pages/NotFound";

export default (
  <Switch>
    {allRoutes}
    <Route component={NotFound} />
  </Switch>
);
