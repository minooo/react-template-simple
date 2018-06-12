import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import App from "./App";
import routes from "./routes";

import "../3-static/styles/font.scss";
import "../3-static/styles/common.scss";
import "../3-static/styles/special.scss";

const Root = ({ store, history }) => (
  <Provider store={store}>
    <App>
      <ConnectedRouter history={history}>
        <div className="box bg-body h-full">{routes}</div>
      </ConnectedRouter>
    </App>
  </Provider>
);

export default Root;
