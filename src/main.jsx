import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./app";
import store from "./stores";
import "lib-flexible";

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
    </Provider>,
    document.getElementById("root")
  );

// webpack进行热更新
if (module.hot) {
    module.hot.accept();
}
