/// <reference types="webpack-env" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { loadableReady } from "@loadable/component";
import createStore from "./redux/store";
import Root from "./App";

const createApp = (Component) => {
  // 获取服务端初始化的state，创建store
  const initialState = (window as any).__INITIAL_STATE__;
  const store = createStore(initialState);
  const App = () => {
    return (
      <Provider store={store}>
        <Router>
          <Component />
        </Router>
      </Provider>
    );
  };
  return <App />;
}

// 加载所需的组件
loadableReady().then(() => {
  ReactDOM.hydrate(createApp(Root), document.getElementById("app"));
});

// 热更新
if (module.hot) {
  module.hot.accept("./App", () => {
    const NewApp = require("./App").default;
    ReactDOM.hydrate(createApp(NewApp), document.getElementById("app"));
  });
}
