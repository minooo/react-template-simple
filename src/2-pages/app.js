import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "../7-root/index";
import configureStore, { history } from "../4-store";
import RootSaga from "../4-store/saga";

const store = configureStore(window.__INITIAL_STATE__); // eslint-disable-line
store.runSaga(RootSaga);

const render = Component => {
  ReactDOM.render(
    <AppContainer warnings={false}>{Component}</AppContainer>,
    document.getElementById("app")
  );
};

render(<Root store={store} history={history} />);

if (module.hot) {
  module.hot.accept("../7-root/index", () => {
    render(<Root store={store} history={history} />);
  });
}
